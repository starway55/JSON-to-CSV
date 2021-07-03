const { getVideoCsvRowsFromVideoIds, filterVideoIds } = require("@src/services/VideoInfoFilter");
const axios = require("axios");

jest.mock('axios');

describe("filterVideoIds function", () => {

  test("It should detect video id in contentVideo fields when content has video", () => {
    const inputData = {
      data: [
        {
          contentHasVideo: true,
          contentVideo: {
            id: "videoId1"
          }
        },
        {
          contentHasVideo: true,
          contentVideo: {
            id: "videoId2"
          }
        },
        {
          contentHasVideo: false,
          contentVideo: {
            id: "videoIdShouldNotBeHere"
          }
        }
      ]
    };
    const expectedOutput = ["videoId1", "videoId2"];

    const videoIds = filterVideoIds(inputData);

    expect(videoIds).toEqual(expectedOutput);
  });

  test("It should detect video id in contentGalleryArray when mediaType is video", () => {
    const inputData = {
      data: [
        {
          contentGallery: [
            {
              mediaType: "image",
              url: "imageUrl1"
            },
            {
              mediaType: "video",
              videoId: "videoId1"
            }
          ]
        }
      ]
    }

    const expectedOutput = ["videoId1"];

    const videoIds = filterVideoIds(inputData);

    expect(videoIds).toEqual(expectedOutput);
  });


});

describe("getVideoCsvRowsFromVideoIds function", () => {

  test("It should get valid videoId, title, link and highestResolutionVideoLink for a standard video record", async () => {

    axios.get.mockImplementationOnce(
      (apiUrl) => Promise.resolve({
        status: 200,
        data: {
          title: "title1",
          playlist: [
            {
              mediaid: "videoId1",
              link: "link1",
              sources: [
                {
                  file: "videoUrl1",
                  height: 180,
                  width: 320
                }
              ]
            }
          ]
        }
      })
    ).mockImplementationOnce(
      (apiUrl) => Promise.resolve({
        status: 200,
        data: {
          title: "title2",
          playlist: [
            {
              mediaid: "videoId2",
              link: "link2",
              sources: [
                {
                  file: "videoUrl2",
                  height: 1024,
                  width: 768
                }
              ]
            }
          ]
        }
      })
    );

    const expectedOutput = 
    [
      {
        videoId: "videoId1",
        title: "title1",
        link: "link1",
        highestResolutionVideoLink: "videoUrl1"
      },
      {
        videoId: "videoId2",
        title: "title2",
        link: "link2",
        highestResolutionVideoLink: "videoUrl2"
      }
    ];

    const videoRecords = await getVideoCsvRowsFromVideoIds(["videoId1", "videoId2"]);

    expect(videoRecords).toEqual(expectedOutput);
  });

  test("It should get highestResolutionVideoLink with the video resource that's with highest width x height", async () => {

    axios.get.mockImplementation(
      (apiUrl) => Promise.resolve({
        status: 200,
        data: {
          title: "title1",
          playlist: [
            {
              mediaid: "videoId1",
              link: "link1",
              sources: [
                {
                  file: "videoUrl1",
                  height: 180,
                  width: 320
                },
                {
                  file: "videoUrl2",
                  height: 768,
                  width: 1024
                }
              ]
            }
          ]
        }
      })
    );

    const expectedOutput = 
    [
      {
        videoId: "videoId1",
        title: "title1",
        link: "link1",
        highestResolutionVideoLink: "videoUrl2"
      }
    ]

    const videoRecords = await getVideoCsvRowsFromVideoIds(["videoId1"]);

    expect(videoRecords).toEqual(expectedOutput);
  });

  test("It should get m3u8 video link if no video source has width and height information", async () => {
    axios.get.mockImplementation(
      (apiUrl) => Promise.resolve({
        status: 200,
        data: {
          title: "title1",
          playlist: [
            {
              mediaid: "videoId1",
              link: "link1",
              sources: [
                {
                  file: "whatever.m3u8",
                  type: "application/vnd.apple.mpegurl"
                },
                {
                  file: "whatever.m4a",
                  type: "audio/mp4",
                  fileSize: 100000
                }
              ]
            }
          ]
        }
      })
    );

    const expectedOutput =
    [
      {
        videoId: "videoId1",
        title: "title1",
        link: "link1",
        highestResolutionVideoLink: "whatever.m3u8"
      }
    ];

    const videoRecords = await getVideoCsvRowsFromVideoIds(["videoId1"]);

    expect(videoRecords).toEqual(expectedOutput);
  });

  test("It should get empty highestResolutionUrl if there is no video with width or height and no m3u8 link", async () => {
    axios.get.mockImplementation(
      (apiUrl) => Promise.resolve({
        status: 200,
        data: {
          title: "title1",
          playlist: [
            {
              mediaid: "videoId1",
              link: "link1",
              sources: [
                {
                  file: "whatever.m4a",
                  type: "audio/mp4",
                  fileSize: 100000
                }
              ]
            }
          ]
        }
      })
    );

    const expectedOutput =
    [
      {
        videoId: "videoId1",
        title: "title1",
        link: "link1",
        highestResolutionVideoLink: ""
      }
    ];

    const videoRecords = await getVideoCsvRowsFromVideoIds(["videoId1"]);

    expect(videoRecords).toEqual(expectedOutput);
  });
})
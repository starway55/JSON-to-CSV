const { getImageCsvRowsFromInputJson } = require("@src/services/ImageInfoFilter");

describe("Image Info Filter", () => {

  test("It should detect contentUrl fields and generate image records", () => {
    const inputData = {
      data: [
        {
          id: "id1",
          contentImageUrl: "imageUrl1"
        },
        {
          id: "id2",
          contentImageUrl: "imageUrl2"
        }
      ]
    };
    const expectedOutput = [
      {
        id: "id1",
        imageUrl: "imageUrl1"
      },
      {
        id: "id2",
        imageUrl: "imageUrl2"
      }
    ];

    const records = getImageCsvRowsFromInputJson(inputData);

    expect(records).toEqual(expectedOutput);
  });

  test("It should detect images in contentGallery fields and generate image records", () => {
    const inputData = {
      data: [
        {
          id: "id1",
          contentGallery: [
            {
              mediaType: "image",
              url: "imageUrl1"
            },
            {
              mediaType: "notImage",
              url: "imageUrl2"
            }
          ]
        }
      ]
    };

    const expectedOutput = [
      {
        id: "id1",
        imageUrl: "imageUrl1"
      }
    ];

    const records = getImageCsvRowsFromInputJson(inputData);

    expect(records).toEqual(expectedOutput);
  });

  test("it should detect images in contentBody fields and generate image records", () => {
    const inputData = {
      data: [
        {
          id: "id1",
          contentBody: [
            {
              type: "paragraph",
              label: "Paragraph",
              content: "whatever"
            },
            {
              type: "image",
              label: "Image",
              content: {
                url: "imageUrl1"
              }
            }
          ]
        }
      ]
    };

    const expectedOutput = [
      {
        id: "id1",
        imageUrl: "imageUrl1"
      }
    ];

    const records = getImageCsvRowsFromInputJson(inputData);
    expect(records).toEqual(expectedOutput);
    
  });

  test("It should throw error if no id is found in any data in the array", () => {
    const inputData = {
      data: [
        {
          id: "id1"
        },
        {
          noId: "noId"
        }
      ]
    };

    const errorObject = {
      noId: "noId"
    };

    expect(
      () => getImageCsvRowsFromInputJson(inputData)
    ).toThrow(`No id found in inputJson ${errorObject}`);
    
  });
})
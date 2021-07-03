const axios = require("axios");

/**
 * Filters video Ids from input JSON data.
 * Find video Ids in data.contentVideo field
 * and contentGallery array if media type is "video"
 * 
 * @param {Object} inputData 
 * @returns {Array}
 */
const filterVideoIds = (inputData) => {
  const videoIds = [];
  inputData.data.map(data => {
    if(data.contentHasVideo){
      videoIds.push(data.contentVideo.id);
    }
    if(data.contentGallery){
      data.contentGallery.map(oneContentGallery => {
        if(oneContentGallery.mediaType === "video"){
          videoIds.push(oneContentGallery.videoId);
        }
      })
    }
  });

  return videoIds;
}

/**
 * Calls JW Player API for each id of the input video id Array
 * Get rows of the video CSV file from the responses from JW player API
 * 
 * @param {Array} videoIds 
 * @returns {Array}
 */
const getVideoCsvRowsFromVideoIds = async (videoIds) => {

  const responseArray = await Promise.all(videoIds.map(async videoId => {
    return await axios.get(`https://cdn.jwplayer.com/v2/media/${videoId}`);
  }));

  const videoRecords = [];

  responseArray.map(response => {
    const responseData = response.data;
    const videoId = responseData.playlist[0].mediaid;
    const title = responseData.title;
    const link = responseData.playlist[0].link;

    const sources = responseData.playlist[0].sources;
    let highestResolutionVideoLink = "";
    let m3u8Link;
    let highestResolution = 0;
    sources.map(source => {
      if(source.width && source.height){
        const resolution = source.width * source.height;

        if(resolution > highestResolution){
          highestResolutionVideoLink = source.file;
          highestResolution = resolution;
        }
      }
      if(source.file && source.file.endsWith(".m3u8")){
        m3u8Link = source.file;
      }
    });

    if(highestResolutionVideoLink === "" && m3u8Link){
      highestResolutionVideoLink = m3u8Link;
    }

    videoRecords.push({
      videoId,
      title,
      link,
      highestResolutionVideoLink
    })
  });

  return videoRecords;
}

module.exports = {
  getVideoCsvRowsFromVideoIds,
  filterVideoIds
}
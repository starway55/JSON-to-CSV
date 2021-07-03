const { getVideoCsvRowsFromVideoIds, filterVideoIds } = require("@src/services/VideoInfoFilter");
const { videoCsvHeader } = require("@src/constants/CsvConstants");
const { generateCSVFile } = require("@src/services/CsvWriter");

const generateVideoCsv = async (inputData) => {

  const videoIds = filterVideoIds(inputData);
  const videoCsvRows = await getVideoCsvRowsFromVideoIds(videoIds);

  await generateCSVFile("videos.csv", videoCsvHeader, videoCsvRows);
}

module.exports = {
  generateVideoCsv
}
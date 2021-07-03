const { getImageCsvRowsFromInputJson } = require("@src/services/ImageInfoFilter");
const { imageCsvHeader } = require("@src/constants/CsvConstants");
const { generateCSVFile } = require("@src/services/CsvWriter");

const generateImageCsv = async (inputData) => {

  const imageCsvRows = getImageCsvRowsFromInputJson(inputData);

  await generateCSVFile("images.csv", imageCsvHeader, imageCsvRows);
}

module.exports = {
  generateImageCsv
}
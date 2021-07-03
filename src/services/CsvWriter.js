const { createObjectCsvWriter } = require("csv-writer");

const generateCSVFile = async (fileName, header, records) => {
  const imageCsvWriter = createObjectCsvWriter({
    // This path is relavent to the project's root
    path: `./${fileName}`,
    header
  });

  await imageCsvWriter.writeRecords(records);
}

module.exports = {
  generateCSVFile
}
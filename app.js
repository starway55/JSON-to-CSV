require('module-alias/register');

const jsonData = require("./are-media-backend-developer-test.json");
const { generateImageCsv } = require("@src/apps/ImageInfoProcessor");
const { generateVideoCsv } = require("@src/apps/VideoInfoProcessor");

const jsonToCsv = async () => {

  await generateImageCsv(jsonData);
  await generateVideoCsv(jsonData);
}

jsonToCsv();
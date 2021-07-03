/**
 * Filters rows for image CSV file from input JSON data
 * and put the rows in an array.
 * 
 * @param {Object} inputJson 
 * @returns {Array}
 */
const getImageCsvRowsFromInputJson = (inputJson) => {

  const imageRows = [];

  inputJson.data.map(oneData => {
    const { id, contentImageUrl, contentGallery, contentBody } = oneData;

    if(!id){
      throw new Error(`No id found in inputJson ${oneData}`);
    }

    if(contentImageUrl){
      imageRows.push({
        id,
        imageUrl: contentImageUrl
      });
    }

    if(contentGallery){
      contentGallery.map(oneContentGallery => {
        if(oneContentGallery.mediaType === "image" && oneContentGallery.url){
          imageRows.push({
            id,
            imageUrl: oneContentGallery.url
          })
        }
      });
    }

    if(contentBody){
      contentBody.map(oneContentBody => {
        if(oneContentBody.type === "image" && oneContentBody.content.url){
          imageRows.push({
            id,
            imageUrl: oneContentBody.content.url
          })
        }
      });
    }
  });

  return imageRows;
}

module.exports = {
  getImageCsvRowsFromInputJson
}
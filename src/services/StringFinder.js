
/**
 * This is my solution to recursively find image url like strings in an object of unknown structure.
 * This was written before I got the clear requirements
 * This is not used anymore.
 * Keeping it here for your possible interest.
 * 
 * @param {String | Array | Object} input 
 * @param {Array} resultArray 
 * @returns {Array}
 */
const findStringsInObjectRecursively = (input, resultArray) => {

  if(!input) return resultArray;

  if(typeof input === "string"){
    if(!resultArray.includes(input) && (input.endsWith(".png") || input.endsWith(".jpg") || input.endsWith(".jpeg") ) ){
      resultArray.push(input);
    }
  }

  if(typeof input === "object"){
    Object.keys(input).map(key => {
      const value = input[key];
      resultArray.concat(findStringsInObjectRecursively(value, resultArray));
    });
  }

  if(Array.isArray(input)){
    input.map(element => {
      resultArray.concat(findStringsInObjectRecursively(element, resultArray));
    })
  }

  return resultArray;
}
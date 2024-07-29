function extractSubArray(array, startIndex, length) {
    if (!Array.isArray(array)) {
      throw new TypeError('The first argument must be an array.');
    }
    if (typeof startIndex !== 'number' || typeof length !== 'number') {
      throw new TypeError('The startIndex and length must be numbers.');
    }
    if (startIndex < 0 || length < 0 || startIndex >= array.length) {
      throw new RangeError('Invalid startIndex or length.');
    }
  
    return array.slice(startIndex, startIndex + length);
  }


  function removeSpaces(str) {
    return str.replace(/\s+/g, '');
  }


  function getSortQueryCode(sortOption) {
    let sort = {};
    switch (sortOption) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'name-asc':
          sort = { item_name: 1 };
          break;
        case 'name-desc':
          sort = { item_name: -1 };
          break;
        default:
          break;
      }
      return sort;
  }

  function isJsonString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  module.exports = { extractSubArray, removeSpaces, getSortQueryCode, isJsonString };
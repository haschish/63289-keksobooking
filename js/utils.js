'use strict';
(function () {
  var getRandomItem = function (array, exclude) {
    if (exclude && exclude.length) {
      array = array.filter(function (item) {
        return exclude.indexOf(item) === -1;
      });
    }

    var randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  var getValuesOf = function (array, prop) {
    var keys = prop.split('.');

    return array.map(function (item) {
      keys.some(function (key) {
        item = item[key];
        return typeof item === 'undefined';
      });

      return item;
    });
  };

  var getRandomPositiveNumber = function (min, max) {
    min = min || 0;
    max = max || Number.MAX_SAFE_INTEGER;

    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getLeadingZeroNumber = function (num, length) {
    var strNum = String(num);
    var numberOfZeros = Math.max(0, length - strNum.length);
    var zeros = new Array(numberOfZeros + 1).join('0');

    return zeros + strNum;
  };

  var randomCompare = function () {
    return Math.random() - 0.5;
  };

  window.utils = {
    getRandomItem: getRandomItem,
    getValuesOf: getValuesOf,
    getRandomPositiveNumber: getRandomPositiveNumber,
    getLeadingZeroNumber: getLeadingZeroNumber,
    randomCompare: randomCompare
  };
})();

'use strict';
(function () {
  var TYPES = {
    flat: {text: 'Квартира', minPrice: 1000},
    house: {text: 'Дом', minPrice: 5000},
    bungalo: {text: 'Бунгало', minPrice: 0},
    palace: {text: 'Дворец', minPrice: 10000}
  };
  var WIDTH_PIN = 50;
  var HEIGHT_PIN = 70;
  var HEIGHT_MAP_PIN_MAIN_TIP = 10;

  window.consts = {
    TYPES: TYPES,
    WIDTH_PIN: WIDTH_PIN,
    HEIGHT_PIN: HEIGHT_PIN,
    HEIGHT_MAP_PIN_MAIN_TIP: HEIGHT_MAP_PIN_MAIN_TIP
  };
})();

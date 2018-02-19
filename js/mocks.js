'use strict';
(function () {
  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var CHECKIN_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var generateAds = function (num) {
    var data = [];
    var x;
    var y;
    for (var i = 1; i <= num; i++) {
      x = window.utils.getRandomPositiveNumber(300, 900);
      y = window.utils.getRandomPositiveNumber(150, 500);
      data.push({
        author: {
          avatar: 'img/avatars/user' + window.utils.getLeadingZeroNumber(i, 2) + '.png'
        },
        offer: {
          title: window.utils.getRandomItem(TITLES, window.utils.getValuesOf(data, 'offer.title')),
          address: x + ',' + y,
          price: window.utils.getRandomPositiveNumber(1000, 1000000),
          type: window.utils.getRandomItem(Object.keys(window.consts.TYPES)),
          rooms: window.utils.getRandomPositiveNumber(1, 5),
          guests: window.utils.getRandomPositiveNumber(1, 13),
          checkin: window.utils.getRandomItem(CHECKIN_TIMES),
          checkout: window.utils.getRandomItem(CHECKIN_TIMES),
          features: FEATURES.slice(window.utils.getRandomPositiveNumber(0, FEATURES.length - 1)),
          description: '',
          photos: PHOTOS.slice().sort(window.utils.randomCompare)
        },
        location: {
          x: x,
          y: y
        }
      });
    }

    return data;
  };

  window.mocks = {
    generateAds: generateAds
  };
})();

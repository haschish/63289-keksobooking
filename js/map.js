'use strict';
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
var TYPES = [
  'flat',
  'house',
  'bungalo'
];
var MAP_TYPES = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
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

var generateAds = function (num) {
  var data = [];
  var x;
  var y;
  for (var i = 1; i <= num; i++) {
    x = getRandomPositiveNumber(300, 900);
    y = getRandomPositiveNumber(150, 500);
    data.push({
      author: {
        avatar: 'img/avatars/user' + getLeadingZeroNumber(i, 2) + '.png'
      },
      offer: {
        title: getRandomItem(TITLES, getValuesOf(data, 'offer.title')),
        address: x + ',' + y,
        price: getRandomPositiveNumber(1000, 1000000),
        type: getRandomItem(TYPES),
        rooms: getRandomPositiveNumber(1, 5),
        guests: getRandomPositiveNumber(1, 13),
        checkin: getRandomItem(CHECKIN_TIMES),
        checkout: getRandomItem(CHECKIN_TIMES),
        features: FEATURES.slice(getRandomPositiveNumber(0, FEATURES.length - 1)),
        description: '',
        photos: PHOTOS.slice().sort(randomCompare)
      },
      location: {
        x: x,
        y: y
      }
    });
  }

  return data;
};

var getMapPins = function (data, template) {
  var fragment = document.createDocumentFragment();
  data.forEach(function (item) {
    var clone = template.cloneNode(true);
    clone.style.left = item.location.x - 25 + 'px';
    clone.style.top = item.location.y - 70 + 'px';
    clone.querySelector('img').src = item.author.avatar;
    fragment.appendChild(clone);
  });

  return fragment;
};

var getFeatures = function (data) {
  var fragment = document.createDocumentFragment();
  data.forEach(function (item) {
    var li = document.createElement('li');
    li.classList.add('feature', 'feature--' + item);
    fragment.appendChild(li);
  });
  return fragment;
};

var getPictures = function (data) {
  var fragment = document.createDocumentFragment();
  data.forEach(function (item) {
    var li = document.createElement('li');
    var img = document.createElement('img');
    img.src = item;
    li.appendChild(img);
    fragment.appendChild(li);
  });
  return fragment;
};

var getMapCard = function (data, template) {
  var mapCard = template.cloneNode(true);

  mapCard.querySelector('h3').textContent = data.offer.title;
  mapCard.querySelector('.popup__price').textContent = data.offer.price + '\u20BD/ночь';
  var h4 = mapCard.querySelector('h4');
  h4.textContent = MAP_TYPES[data.offer.type];
  h4.nextElementSibling.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  h4.nextElementSibling.nextElementSibling.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;

  var features = mapCard.querySelector('.popup__features');
  var newFeatures = features.cloneNode();
  newFeatures.appendChild(getFeatures(data.offer.features));
  mapCard.replaceChild(newFeatures, features);

  var pictures = mapCard.querySelector('.popup__pictures');
  var newPictures = pictures.cloneNode();
  newPictures.appendChild(getPictures(data.offer.photos));
  mapCard.replaceChild(newPictures, pictures);

  mapCard.querySelector('.popup__avatar').src = data.author.avatar;

  return mapCard;
};


var blockMap = document.querySelector('.map');
var template = document.querySelector('template').content;
var templateMapPin = template.querySelector('.map__pin');
var templateMapCard = template.querySelector('.map__card');
var testData = generateAds(8);
var mapCard = getMapCard(testData[0], templateMapCard);

blockMap.classList.remove('map--faded');
blockMap.querySelector('.map__pins').appendChild(getMapPins(testData, templateMapPin));
blockMap.insertBefore(mapCard, blockMap.querySelector('.map__filters-container'));

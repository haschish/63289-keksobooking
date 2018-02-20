'use strict';
(function () {
  var WIDTH_PIN = 50;
  var HEIGHT_PIN = 70;
  var HEIGHT_MAP_PIN_MAIN_TIP = 10;
  var HEIGHT_SKY = 140;

  var blockMap = document.querySelector('.map');
  var filterContainer = blockMap.querySelector('.map__filters-container');
  var mapPinMain = blockMap.querySelector('.map__pin--main');
  var template = document.querySelector('template').content;
  var testData = window.mocks.generateAds(8);



  var getMapPins = function (data, el) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (item, i) {
      var clone = el.cloneNode(true);
      clone.dataset.index = i;
      clone.style.left = item.location.x - WIDTH_PIN / 2 + 'px';
      clone.style.top = item.location.y - HEIGHT_PIN + 'px';
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
      img.width = 70;
      li.appendChild(img);
      fragment.appendChild(li);
    });
    return fragment;
  };

  var getMapCard = function (data, el) {
    var mapCard = el.cloneNode(true);

    mapCard.querySelector('h3').textContent = data.offer.title;
    mapCard.querySelector('small').textContent = data.offer.address;
    mapCard.querySelector('.popup__price').textContent = data.offer.price + '\u20BD/ночь';
    mapCard.querySelector('h4').textContent = window.consts.TYPES[data.offer.type]['text'];
    mapCard.querySelector('p:nth-of-type(4)').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    mapCard.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    mapCard.querySelector('p:last-of-type').textContent = data.offer.description;

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

  var activate = function () {
    blockMap.classList.remove('map--faded');
    blockMap.addEventListener('click', onMapPinClick, true);
  };

  var getPinMainCoordinate = function () {
    var x = mapPinMain.offsetLeft;
    var y = mapPinMain.offsetTop + mapPinMain.clientHeight + HEIGHT_MAP_PIN_MAIN_TIP;

    return [x, y];
  };

  var fillAds = function () {
    var templateMapPin = template.querySelector('.map__pin');
    blockMap.querySelector('.map__pins').appendChild(getMapPins(testData, templateMapPin));
  };

  var onMapPinClick = function (evt) {
    var element = evt.target;
    var classList = element.classList;
    if (!classList.contains('map__pin')) {
      element = element.parentElement;
      classList = element.classList;
    }

    if (classList.contains('map__pin') && !classList.contains('map__pin--main')) {
      var obj = testData[parseInt(element.dataset.index, 10)];
      showMapCard(obj);
    }
  };

  var showMapCard = function (obj) {
    var templateMapCard = template.querySelector('.map__card');
    var mapCard = getMapCard(obj, templateMapCard);
    var lastMapCard = blockMap.querySelector('map__card');
    if (lastMapCard) {
      blockMap.replaceChild(mapCard, lastMapCard);
    } else {
      blockMap.insertBefore(mapCard, blockMap.querySelector('.map__filters-container'));
    }
  };

  var setAddress = function () {
    window.form.setAddress(getPinMainCoordinate().join(','));
  };

  setAddress();

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var dragged = false;
    var shiftMapPinY = parseInt(mapPinMain.offsetHeight / 2) + HEIGHT_MAP_PIN_MAIN_TIP;
    var minX = 0;
    var maxX = blockMap.offsetWidth;
    var minY = HEIGHT_SKY - shiftMapPinY;
    var maxY = blockMap.offsetHeight - filterContainer.offsetHeight - shiftMapPinY;
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY,
      offsetLeft: mapPinMain.offsetLeft,
      offsetTop: mapPinMain.offsetTop
    };

    var onDocumentMousemove = function (moveEvt) {
      dragged = true;
      var shift = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y
      };
      var pinMainCoords = getPinMainCoordinate();
      var nextX = Math.min(Math.max(startCoords.offsetLeft + shift.x, minX), maxX);
      var nextY = Math.min(Math.max(startCoords.offsetTop + shift.y, minY), maxY);

      mapPinMain.style.left = nextX + 'px';
      mapPinMain.style.top = nextY + 'px';
      setAddress();
    };

    var onDocumentMouseup = function (upEvt) {
      upEvt.preventDefault();
      if (blockMap.classList.contains('map--faded')) {
        activate();
        window.form.activate();
        fillAds();
      }
      setAddress();
      document.removeEventListener('mousemove', onDocumentMousemove);
      document.removeEventListener('mouseup', onDocumentMouseup);
    }

    document.addEventListener('mousemove', onDocumentMousemove);
    document.addEventListener('mouseup', onDocumentMouseup);
  });
})();

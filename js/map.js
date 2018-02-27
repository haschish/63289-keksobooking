'use strict';
(function () {
  var WIDTH_PIN = 50;
  var HEIGHT_PIN = 70;
  var HEIGHT_PIN_MAIN_TIP = 10;
  var HEIGHT_SKY = 140;
  var MAX_PINS = 5;
  var ANY = 'any';
  var Price = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var blockMap = document.querySelector('.map');
  var filterContainer = blockMap.querySelector('.map__filters-container');
  var mapFilters = filterContainer.querySelector('form');
  var mapPinMain = blockMap.querySelector('.map__pin--main');
  var template = document.querySelector('template').content;
  var dataAds = [];
  var filteredAds = [];


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
    mapCard.querySelector('p:nth-of-type(3)').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
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
    var y = mapPinMain.offsetTop + mapPinMain.clientHeight + HEIGHT_PIN_MAIN_TIP;

    return [x, y];
  };

  var loadAds = function () {
    var onLoad = function (data) {
      dataAds = data;
      renderAds();
    };
    var onError = function (msg) {
      window.notifications.error(msg);
    };

    window.backend.loadAds(onLoad, onError);
  };

  var isMatchHousingType = function (formValue, type) {
    return formValue === ANY || formValue === type;
  };

  var isMatchHoustingPrice = function (formValue, price) {
    var match = true;
    switch (formValue) {
      case Price.LOW: match = price < 10000; break;
      case Price.MIDDLE: match = price >= 10000 && price < 50000; break;
      case Price.HIGH: match = price >= 50000; break;
    }

    return match;
  };

  var isMatchHousingRooms = function (formValue, rooms) {
    return formValue === ANY || parseInt(formValue, 10) === rooms;
  };

  var isMatchHousingGuests = function (formValue, guests) {
    return formValue === ANY || parseInt(formValue, 10) <= guests;
  };

  var isMatchFeatures = function (formValue, features) {
    var match = true;
    if (formValue.length > 0) {
      match = formValue.every(function (item) {
        return features.indexOf(item) !== -1;
      });
    }

    return match;
  };

  var renderAds = function () {
    var mapPinsEl = blockMap.querySelector('.map__pins');
    var pins = mapPinsEl.querySelectorAll('.map__pin:not(.map__pin--main)');
    var templateMapPin = template.querySelector('.map__pin');
    var formData = getMapFilterData();
    filteredAds = dataAds.slice(0).filter(function (item) {
      return isMatchHousingType(formData['housing-type'], item.offer.type) &&
        isMatchHoustingPrice(formData['housing-price'], item.offer.price) &&
        isMatchHousingRooms(formData['housing-rooms'], item.offer.rooms) &&
        isMatchHousingGuests(formData['housing-guests'], item.offer.guests) &&
        isMatchFeatures(formData.features, item.offer.features);
    }).slice(0, MAX_PINS);
    pins.forEach(function (pin) {
      mapPinsEl.removeChild(pin);
    });
    mapPinsEl.appendChild(getMapPins(filteredAds, templateMapPin));
  };

  var getMapFilterData = function () {
    var data = {features: []};
    mapFilters.querySelectorAll('select').forEach(function (item) {
      data[item.name] = item.value;
    });
    mapFilters.querySelectorAll('input:checked').forEach(function (item) {
      data.features.push(item.value);
    });

    return data;
  };

  var onMapPinClick = function (evt) {
    var element = evt.target;
    var classList = element.classList;
    if (!classList.contains('map__pin')) {
      element = element.parentElement;
      classList = element.classList;
    }

    if (classList.contains('map__pin') && !classList.contains('map__pin--main')) {
      var obj = filteredAds[parseInt(element.dataset.index, 10)];
      showMapCard(obj);
    }
  };

  var showMapCard = function (obj) {
    var templateMapCard = template.querySelector('.map__card');
    var mapCard = getMapCard(obj, templateMapCard);
    var lastMapCard = blockMap.querySelector('.map__card');
    if (lastMapCard) {
      blockMap.replaceChild(mapCard, lastMapCard);
    } else {
      blockMap.insertBefore(mapCard, blockMap.querySelector('.map__filters-container'));
    }
  };

  var hideMapCard = function () {
    var mapCard = blockMap.querySelector('.map__card');
    if (mapCard) {
      mapCard.hidden = true;
    }
  };

  var setAddress = function () {
    window.form.setAddress(getPinMainCoordinate().join(','));
  };

  var onChangeMapFilters = window.utils.debounce(function () {
    hideMapCard();
    renderAds();
  }, 500);

  mapFilters.addEventListener('change', onChangeMapFilters);

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var shiftMapPinY = parseInt(mapPinMain.offsetHeight / 2, 10) + HEIGHT_PIN_MAIN_TIP;
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
      var shift = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y
      };
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
        loadAds();
      }
      setAddress();
      document.removeEventListener('mousemove', onDocumentMousemove);
      document.removeEventListener('mouseup', onDocumentMouseup);
    };

    document.addEventListener('mousemove', onDocumentMousemove);
    document.addEventListener('mouseup', onDocumentMouseup);
  });

  setAddress();
  window.map = {
    getPinMainCoordinate: getPinMainCoordinate
  };
})();

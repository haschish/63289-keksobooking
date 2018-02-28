'use strict';
(function () {
  var ESC_CODE = 27;

  var blockMap = document.querySelector('.map');
  var card;
  var closeButton;

  var onDocumentKeydown = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      hide();
    }
  };

  var onCloseButtonClick = function () {
    hide();
  };

  var insert = function () {
    var template = document.querySelector('template').content;
    var templateCard = template.querySelector('.map__card');
    card = templateCard.cloneNode(true);
    card.hidden = true;
    blockMap.insertBefore(card, blockMap.querySelector('.map__filters-container'));
    closeButton = card.querySelector('.popup__close');
  };

  var show = function () {
    if (!card) {
      return;
    }

    card.hidden = false;
    document.addEventListener('keydown', onDocumentKeydown);
    closeButton.addEventListener('click', onCloseButtonClick);
  };

  var hide = function () {
    if (!card) {
      return;
    }

    card.hidden = true;
    document.removeEventListener('keydown', onDocumentKeydown);
    closeButton.removeEventListener('click', onCloseButtonClick);
  };

  var isHide = function () {
    return card.hidden;
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

  var render = function (data) {
    if (!card) {
      insert();
    }
    card.querySelector('h3').textContent = data.offer.title;
    card.querySelector('small').textContent = data.offer.address;
    card.querySelector('.popup__price').textContent = data.offer.price + '\u20BD/ночь';
    card.querySelector('h4').textContent = window.consts.TYPES[data.offer.type]['text'];
    card.querySelector('p:nth-of-type(3)').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    card.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    card.querySelector('p:last-of-type').textContent = data.offer.description;

    var features = card.querySelector('.popup__features');
    var newFeatures = features.cloneNode();
    newFeatures.appendChild(getFeatures(data.offer.features));
    card.replaceChild(newFeatures, features);

    var pictures = card.querySelector('.popup__pictures');
    var newPictures = pictures.cloneNode();
    newPictures.appendChild(getPictures(data.offer.photos));
    card.replaceChild(newPictures, pictures);

    card.querySelector('.popup__avatar').src = data.author.avatar;

    if (isHide()) {
      show();
    }
  };

  window.adCard = {
    render: render,
    show: show,
    hide: hide
  };
})();

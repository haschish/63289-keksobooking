'use strict';
(function () {
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormType = noticeForm.querySelector('#type');
  var noticeFormPrice = noticeForm.querySelector('#price');
  var noticeFormRoomNumber = noticeForm.querySelector('#room_number');
  var noticeFormCapacity = noticeForm.querySelector('#capacity');
  var noticeFormTimein = noticeForm.querySelector('#timein');
  var noticeFormTimeout = noticeForm.querySelector('#timeout');
  var updatePrice = function () {
    var type = window.consts.TYPES[noticeFormType.value];
    noticeFormPrice.min = type.minPrice;
  };
  var updateCapacity = function () {
    var roomNumber = parseInt(noticeFormRoomNumber.value, 10);
    var capacity = noticeFormCapacity.value;
    var currentCapacityOption = noticeFormCapacity.querySelector('option[value="' + capacity + '"]');
    var errorMessage;
    var items = noticeFormCapacity.querySelectorAll('option');

    items.forEach(function (item) {
      var value = parseInt(item.value, 10);
      if (roomNumber === 100) {
        item.disabled = (value !== 0);
      } else {
        item.disabled = (value === 0 || value > roomNumber);
      }
    });

    errorMessage = currentCapacityOption.disabled ? 'Некорректный выбор' : '';
    noticeFormCapacity.setCustomValidity(errorMessage);
  };
  var setAddress = function (value) {
    noticeForm.querySelector('#address').value = value;
  };
  var activate = function () {
    noticeForm.classList.remove('notice__form--disabled');
  };

  noticeForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(noticeForm);
    var onSuccess = function () {
      noticeForm.reset();
      window.notifications.success('Данные формы успешно отправлены.');
    };
    var onError = function (msg) {
      window.notifications.error(msg);
    };
    window.backend.save(formData, onSuccess, onError);
  });

  noticeFormType.addEventListener('change', function () {
    updatePrice();
  });

  noticeFormRoomNumber.addEventListener('change', function () {
    updateCapacity();
  });

  noticeFormCapacity.addEventListener('change', function () {
    updateCapacity();
  });

  noticeFormTimein.addEventListener('change', function () {
    noticeFormTimeout.value = noticeFormTimein.value;
  });

  noticeFormTimeout.addEventListener('change', function () {
    noticeFormTimein.value = noticeFormTimeout.value;
  });

  updatePrice();
  updateCapacity();

  window.form = {
    setAddress: setAddress,
    activate: activate
  };
})();

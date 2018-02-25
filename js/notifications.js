'use strict';
(function () {
  var typeToClassMap = {
    'error': 'notifications__item_error',
    'success': 'notifications__item_success'
  };
  var notifications = document.querySelector('.notifications');

  var getNotification = function (type) {
    var div = document.createElement('div');
    div.classList.add('notifications__item', typeToClassMap[type]);
    return div;
  };

  var addNotification = function (type, msg) {
    var notification = getNotification(type);
    notification.textContent = msg;
    notifications.appendChild(notification);
    setTimeout(function () {
      notifications.removeChild(notification);
    }, 5000);
  };

  var error = function (msg) {
    addNotification('error', msg);
  };

  var success = function (msg) {
    addNotification('success', msg);
  };
  window.notifications = {
    error: error,
    success: success
  };
})();

// Polyfill ES6 Promise
require('es6-promise').polyfill();

// Polyfill URLSearchParams
URLSearchParams = require('url-search-params');

// Import axios
axios = require('../../index');

// Jasmine config
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
jasmine.getEnv().defaultTimeoutInterval = 20000;

// Get Ajax request using an increasing timeout to retry
getAjaxRequest = (function () { // 获取ajax的请求 (类似模拟服务器, 接收ajax请求)
  var attempts = 0;
  var MAX_ATTEMPTS = 5;
  var ATTEMPT_DELAY_FACTOR = 5;

  function getAjaxRequest() {
    return new Promise(function (resolve, reject) {
      attempts = 0;
      attemptGettingAjaxRequest(resolve, reject);
    });
  }

  function attemptGettingAjaxRequest(resolve, reject) {
    var delay = attempts * attempts * ATTEMPT_DELAY_FACTOR;

    if (attempts++ > MAX_ATTEMPTS) {
      reject(new Error('No request was found'));
      return;
    }

    setTimeout(function () {
      var request = jasmine.Ajax.requests.mostRecent();
      if (request) {
        resolve(request);
      } else {
        attemptGettingAjaxRequest(resolve, reject);
      }
    }, delay);
  }

  return getAjaxRequest;
})();

// Validate an invalid character error
validateInvalidCharacterError = function validateInvalidCharacterError(error) {
  expect(/character/i.test(error.message)).toEqual(true);
};

// Setup basic auth身份 验证tests
setupBasicAuthTest = function setupBasicAuthTest() {
  beforeEach(function () { // 执行 断言之前, 先执行一次这个
    jasmine.Ajax.install(); // "karma-jasmine-ajax": "^0.1.13",  模拟ajax调用
  });

  afterEach(function () { // 执行完 断言之后, 执行这个
    jasmine.Ajax.uninstall();
  });

  it('should accept HTTP Basic auth with username/password', function (done) {
    axios('/foo', {
      auth: {
        username: 'Aladdin',
        password: 'open sesame'
      }
    });

    setTimeout(function () {
      var request = jasmine.Ajax.requests.mostRecent();

      expect(request.requestHeaders['Authorization']).toEqual('Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
      done();
    }, 100);
  });

  it('should accept HTTP Basic auth credentials with non-Latin1 characters in password', function (done) {
    axios('/foo', {
      auth: {
        username: 'Aladßç£☃din',
        password: 'open sesame'
      }
    }).then(function(response) {
      done(new Error('Should not succeed to make a HTTP Basic auth request with non-latin1 chars in credentials.'));
    }).catch(function(error) {
      validateInvalidCharacterError(error);
      done();
    });
  });
};

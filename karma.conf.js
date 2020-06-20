// Karma configuration
// Generated on Fri Aug 15 2014 23:11:13 GMT-0500 (CDT)

/** karma
 *    Karma是一个基于Node.js的JavaScript测试执行过程管理工具
 *      1. 像 流程 管理 工具
 *      2. 在这里可以布置:
 *          1. 测试框架  frameworks: ['jasmine-ajax', 'jasmine', 'sinon'],
 *          2. 预处理器  preprocessors: { 'xx.js': ['webpack', 'sourcemap']}
 *          3. 使用什么浏览器平台(多浏览器平台测试)  browsers: [xx], customLaunchers: {xx}
 */


// saucelabs用不了, 用puppeteer代替
process.env.CHROME_BIN = require('puppeteer').executablePath()

var webpack = require('webpack');
function createCustomLauncher(browser, version, platform) {
  return {
    base: 'SauceLabs',
    browserName: browser,
    version: version,
    platform: platform
  };
}

module.exports = function(config) {
  var customLaunchers = {};
  var browsers = [];

  /** 目前无法使用
   *     原因: 此处需要 SAUCE 的 账号和密钥, 否则不能使用 SAUCE 进行多平台 headless brower test
   *  可以搜索saucelabs 教程
   *    现在目前好像用不了(注册不了账号 服务器错误406) https://wiki.saucelabs.com/display/public/DOCS/The+Sauce+Labs+Cookbook+Home
   *    https://www.cnblogs.com/sparkling-ly/p/5653402.html
   */
  console.log(process.env.SAUCE_USERNAME , process.env.SAUCE_ACCESS_KEY)
  if (process.env.SAUCE_USERNAME || process.env.SAUCE_ACCESS_KEY) {
    customLaunchers = {};

    var runAll = true;

    /** 提供 Headless Browser 无头游览器 ( 没有图形界面GUI的浏览器, 只需构建dom树 不用重绘重排, 节省很多性能, 适合test和爬虫 )
     */
    var options = [
      'SAUCE_CHROME',
      'SAUCE_FIREFOX',
      'SAUCE_SAFARI',
      'SAUCE_OPERA',
      'SAUCE_IE',
      'SAUCE_EDGE',
      'SAUCE_IOS',
      'SAUCE_ANDROID'
    ];

    options.forEach(function (opt) {
      if (process.env[opt]) {
        runAll = false;
      }
    });

    // Chrome
    if (runAll || process.env.SAUCE_CHROME) {
      customLaunchers.SL_Chrome = createCustomLauncher('chrome');
      // customLaunchers.SL_ChromeDev = createCustomLauncher('chrome', 'dev');
      // customLaunchers.SL_ChromeBeta = createCustomLauncher('chrome', 'beta');
    }

    // Firefox
    if (runAll || process.env.SAUCE_FIREFOX) {
      customLaunchers.SL_Firefox = createCustomLauncher('firefox');
      // customLaunchers.SL_FirefoxDev = createCustomLauncher('firefox', 'dev');
      // customLaunchers.SL_FirefoxBeta = createCustomLauncher('firefox', 'beta');
    }

    // Safari
    if (runAll || process.env.SAUCE_SAFARI) {
      // customLaunchers.SL_Safari7 = createCustomLauncher('safari', 7);
      // customLaunchers.SL_Safari8 = createCustomLauncher('safari', 8);

      customLaunchers.SL_Safari9 = createCustomLauncher(
        "safari",
        9.0,
        "OS X 10.11"
      );
      customLaunchers.SL_Safari10 = createCustomLauncher(
        "safari",
        "10.1",
        "macOS 10.12"
      );
      customLaunchers.SL_Safari11 = createCustomLauncher(
        "safari",
        "11.1",
        "macOS 10.13"
      );
    }

    // Opera
    if (runAll || process.env.SAUCE_OPERA) {
      // TODO The available versions of Opera are too old and lack basic APIs
      // customLaunchers.SL_Opera11 = createCustomLauncher('opera', 11, 'Windows XP');
      // customLaunchers.SL_Opera12 = createCustomLauncher('opera', 12, 'Windows 7');
    }

    // IE
    if (runAll || process.env.SAUCE_IE) {
      customLaunchers.SL_IE11 = createCustomLauncher('internet explorer', 11, 'Windows 8.1');
    }

    // Edge
    if (runAll || process.env.SAUCE_EDGE) {
      customLaunchers.SL_Edge = createCustomLauncher('microsoftedge', null, 'Windows 10');
    }

    // IOS
    if (runAll || process.env.SAUCE_IOS) {
      // TODO IOS7 capture always timesout
      // customLaunchers.SL_IOS7 = createCustomLauncher('iphone', '7.1', 'OS X 10.10');
      // TODO Mobile browsers are causing failures, possibly from too many concurrent VMs
      // customLaunchers.SL_IOS8 = createCustomLauncher('iphone', '8.4', 'OS X 10.10');
      // customLaunchers.SL_IOS9 = createCustomLauncher('iphone', '9.2', 'OS X 10.10');
    }

    // Android
    if (runAll || process.env.SAUCE_ANDROID) {
      // TODO Mobile browsers are causing failures, possibly from too many concurrent VMs
      // customLaunchers.SL_Android4 = createCustomLauncher('android', '4.4', 'Linux');
      // customLaunchers.SL_Android5 = createCustomLauncher('android', '5.1', 'Linux');
    }

    browsers = Object.keys(customLaunchers);
  } else if (process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST !== 'false') {
    console.log(
      'Cannot run on Sauce Labs as encrypted environment variables are not available to PRs. ' +
      'Running on Travis.'
    );
    browsers = ['Firefox'];
  } else {
    console.log('Running locally since SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are not set.');
    // browsers = ['Firefox', 'Chrome', 'Safari', 'Opera'];
    browsers = ['Firefox', 'ChromeHeadless', 'Safari', 'Opera']
  }

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-ajax', 'jasmine', 'sinon'],

    // list of files / patterns to load in the browser
    files: [ // specs 的意思是  标准 规范 的意思   specification 缩写
      'test/specs/__helpers.js',
      'test/specs/**/*.spec.js',
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess预处理器 matching匹配 files before serving提供 them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { // 预处理
      'test/specs/__helpers.js': ['webpack', 'sourcemap'],
      'test/specs/**/*.spec.js': ['webpack', 'sourcemap']
    },

    // test results reporter记者,记录 to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // Disable code coverage覆盖率, as因为 it's breaking CI:
    // reporters: ['dots', 'coverage', 'saucelabs'],
    reporters: ['dots', 'saucelabs'],

    // web server port
    port: 9876,

    // Increase增加 timeouts超时 to prevent防止 the issue with disconnected tests (https://goo.gl/nstA69)
    captureTimeout: 4 * 60 * 1000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 4 * 60 * 1000,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: browsers,
    customLaunchers: customLaunchers,

    // // saucelabs用不了, 用puppeteer代替
    // browsers: ['ChromeHeadless'],
    // customLaunchers: {
    //   Chrome_without_security: {
    //     base: 'Chrome',
    //     flags: ['--disable-web-security', '--disable-site-isolation-trials']
    //   }
    // },

    // Continuous Integration整合 mode
    // if true, Karma captures捕获 browsers, runs the tests and exits
    singleRun: false,

    // Webpack config (作用: 1. 打包模块化, 不然require没法用.  2, 压缩)
    webpack: {
      cache: true,
      devtool: 'inline-source-map',
      // Disable code coverage, as it's breaking CI
      // module: {
      //   postLoaders: [
      //     {
      //       test: /\.js$/,
      //       exclude: /(node_modules|test)/,
      //       loader: 'istanbul-instrumenter'
      //     }
      //   ]
      // },
      externals: [
        {
          './adapters/http': 'var undefined'
        }
      ],
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackServer: {
      stats: {
        colors: true
      }
    },

    // Coverage reporting 覆盖率 报告
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      subdir: '.'
    },

    // SauceLabs config
    sauceLabs: {
      recordScreenshots: false,
      connectOptions: {
        // port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    }
  });
};

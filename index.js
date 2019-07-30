'use strict';
const util = require('util');
const path = require('path');
const through = require('through2');
const PluginError = require('plugin-error');
const moment = require('moment');

const STRATEGY_DATETIME = 'datetime';
const STRATEGY_RANDOM_STRING = 'random-string';
const STRATEGY_CUSTOM_VALUE = 'custom-value';
const RANDOM_STRING = Math.random().toString(11).replace('0.', '');

module.exports = options => {
  options = {
    ...{
      urlParam: 'v',
      strategy: STRATEGY_RANDOM_STRING,
      datetimeFormat: 'DD.MM.Y HH:mm:ss',
      customValue: ''
    }, ...options
  };

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-css-cache-buster', 'Streaming not supported'));
      return;
    }

    if (!/^\.css?$/.test(path.extname(file.path))) {
      cb(new PluginError('gulp-css-cache-buster', util.format('"%s" is not a css file', path.parse(file.path).base)));
      return;
    }

    file.contents = Buffer.from(file.contents.toString().replace(/url\("?([^)"]+)"?\)/g, (str, url) => {
      url = url.replace(/\?[\s\S]*$/, '').trim();
      url = url.replace(/['"]*/g, '');

      if (url.indexOf('base64,') > -1 || url.indexOf('about:blank') > -1 || url === '/') {
        return str;
      }

      let additional = '';
      let version = '';
      switch (options.strategy) {
        case STRATEGY_DATETIME:
          if (options.datetimeFormat === '') {
            cb(new PluginError('gulp-css-cache-buster', 'Datetime format is not defined'));
            return;
          }
          version = moment().format(options.datetimeFormat);
          break;
        case STRATEGY_RANDOM_STRING:
          version = RANDOM_STRING;
          break;
        case STRATEGY_CUSTOM_VALUE:
          version = options.customValue;
          break;
        default:
          cb(new PluginError('gulp-css-cache-buster', 'Strategy is not exist'));
          return;
      }

      if (options.urlParam.length === 0) {
        additional = version;
      } else {
        additional = util.format('%s=%s', options.urlParam, version);
      }

      return 'url(' + url + '?' + additional + ')';
    }));

    this.push(file);
    return cb();
  });
};

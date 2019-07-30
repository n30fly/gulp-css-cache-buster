# gulp-css-cache-buster

> Plugin for Gulp to set version of images in styles


## Install

```
$ npm install --save-dev gulp-css-cache-buster
```


## Usage

```js
const gulp = require('gulp');
const ccBuster = require('gulp-css-cache-buster');

gulp.task('default', () =>
	gulp.src('src/file.css')
		.pipe(ccBuster())
		.pipe(gulp.dest('dist'))
);
```


## API

### ccBuster([options])

#### options

Type: `Object`

##### options.urlParam

Type: `string`<br>
Default: `v`

Name of param appending to image


##### options.strategy

Type: `string`<br>
Default: `random-string`

Variants: `random-string`, `datetime`, `custom-value`


##### options.datetimeFormat

Type: `string`<br>
Default: `DD.MM.Y HH:mm:ss`

See https://momentjs.com/docs/#/displaying/format/


##### options.customValue

Type: `string`<br>
Default: haven't default value

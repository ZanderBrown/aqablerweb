const webpack = require('webpack-stream');
const lessc = require('gulp-less');
const mincss = require('gulp-clean-css');
const minhtml = require('gulp-htmlmin');
const minsvg = require('gulp-svgmin');

const { series, src, dest } = require('gulp');

const output = './aqablerweb/';

export function less(cb: Function) {
	src('./*.less')
		.pipe(lessc())
		.pipe(mincss())
		.pipe(dest(output));
	cb();
};

export function html(cb: Function) {
	src(['index.html'])
		.pipe(minhtml({ collapseWhitespace: true }))
		.pipe(dest(output));
	cb();
};

export function logo(cb: Function) {
	src('./logo.svg')
		.pipe(minsvg())
		.pipe(dest(output));
	cb();
}

export function other(cb: Function) {
	src([
		'./icons/*',
		'robots.txt'
	])
		.pipe(dest(output));
	cb();
};

export function js_index(cb: Function) {
	src(['./index.js', './aqablerweb.js', './*.wasm'])
		.pipe(webpack({
			entry: "./index.js",
			output: {
				webassemblyModuleFilename: "aqabler.wasm",
				filename: "index.js"
			},
			mode: "production"
		}, require("webpack")))
		.pipe(dest(output));
	cb();
};

function _js_service(cb: Function) {
	const path = require('path');
	const cache = require('sw-precache');
	const uglify = require('gulp-uglify');
	cache.write(path.join('tmp', 'service.js'), {
		cacheId: "aqablerweb",
		staticFileGlobs: ['aqablerweb/index.html', 'aqablerweb/*.js', 'aqablerweb/*.css', 'aqablerweb/*.wasm', 'aqablerweb/logo.svg'],
		stripPrefix: 'aqablerweb',
		replacePrefix: '/aqablerweb'
	}, () => {
		src('tmp/*.js').pipe(uglify()).pipe(dest(output));
		cb();
	});
};
export const js_service = series(less, html, logo, _js_service);

export const js = series(js_index, js_service);

function _default(cb: Function) {
	src('./aqablerweb/*').pipe(dest('./docs/'));
	cb();
}

const aqabler = series(less, html, logo, other, js, _default);

export default aqabler;
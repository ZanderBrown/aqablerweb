const webpack = require('webpack-stream');
const lessc = require('gulp-less');
let fav = require('gulp-real-favicon');
const generateFavicon = fav.generateFavicon;
const injectFaviconMarkups = fav.injectFaviconMarkups;
const readFileSync = require('fs').readFileSync;
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

var FAVICON_DATA_FILE = 'faviconData.json';
export function favicons(done: Function) {
	generateFavicon({
		masterPicture: './favicon.png',
		dest: './icons',
		iconsPath: './',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#3030d8',
				margin: '0%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: true,
					declareOnlyDefaultIcon: true
				},
				appName: 'Aqabler'
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'whiteSilhouette',
				backgroundColor: '#3030d8',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: true,
						medium: true,
						big: true,
						rectangle: true
					}
				},
				appName: 'Aqabler'
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#3030d8',
				manifest: {
					name: 'Aqabler',
					startUrl: 'https://zanderbrown.github.io/aqablerweb/',
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'blackAndWhite',
				threshold: 66.40625,
				themeColor: '#3030d8'
			}
		},
		settings: {
			compression: 2,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false,
			readmeFile: false,
			htmlCodeFile: false,
			usePathAsIs: false
		},
		markupFile: FAVICON_DATA_FILE
	}, done);
};

export function html(cb: Function) {
	src(['index.html'])
		.pipe(injectFaviconMarkups(JSON.parse(readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
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
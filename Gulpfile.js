const gulp = require('gulp');
const webpack = require('webpack-stream');
const less = require('gulp-less');
let fav = require('gulp-real-favicon');
const generateFavicon = fav.generateFavicon;
const injectFaviconMarkups = fav.injectFaviconMarkups;
const readFileSync = require('fs').readFileSync;
const mincss = require('gulp-clean-css');
const minhtml = require('gulp-htmlmin');
const minsvg = require('gulp-svgmin');

const output = './aqablerweb/';

gulp.task('default', ['less', 'html', 'logo', 'other', 'js'], () => {
	return gulp.src('./aqablerweb/*').pipe(gulp.dest('./docs/'));
});

gulp.task('other', () => {
	return gulp.src([
		'./icons/*',
		'robots.txt'
	])
		.pipe(gulp.dest(output));
});

gulp.task('js', ['js-index', 'js-service']);

gulp.task('js-index', () => {
	return gulp.src(['./index.js','./aqabler.js', './*.wasm'])
		.pipe(webpack({
			entry: "./index.js",
			output: {
				webassemblyModuleFilename: "aqabler.wasm",
				filename: "index.js"
			},
			mode: "production"
		}, require("webpack")))
		.pipe(gulp.dest(output));
});

gulp.task('js-service', ['less', 'html', 'logo'], cb => {
	const path = require('path');
	const cache = require('sw-precache');
	const uglify = require('gulp-uglify');
	cache.write(path.join('tmp', 'service.js'), {
		cacheId: "aqablerweb",
		staticFileGlobs: ['aqablerweb/index.html', 'aqablerweb/*.js', 'aqablerweb/*.css', 'aqablerweb/*.wasm', 'aqablerweb/logo.svg'],
		stripPrefix: 'aqablerweb',
		replacePrefix: '/aqablerweb'
	}, () => {
		gulp.src('tmp/*.js').pipe(uglify()).pipe(gulp.dest(output));
		cb();
	});
});

gulp.task('less', () => {
	return gulp.src('./*.less')
		.pipe(less())
		.pipe(mincss())
		.pipe(gulp.dest(output));
});

gulp.task('logo', () => {
	return gulp.src('./logo.svg')
		.pipe(minsvg())
		.pipe(gulp.dest(output));
});

var FAVICON_DATA_FILE = 'faviconData.json';
gulp.task('favicons', done => {
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
});

gulp.task('html', ['favicons'], () => {
	return gulp.src(['index.html'])
		.pipe(injectFaviconMarkups(JSON.parse(readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(minhtml({ collapseWhitespace: true }))
		.pipe(gulp.dest(output));
});

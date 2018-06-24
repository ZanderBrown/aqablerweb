const gulp = require('gulp');
const webpack = require('webpack-stream');
const less = require('gulp-less');
const favicon = require('gulp-real-favicon');
const fs = require('fs');
const mincss = require('gulp-clean-css');
const minhtml = require('gulp-htmlmin');

const dest = './docs/';

gulp.task('default', ['js', 'html', 'assets']);

gulp.task('js', ['js-index', 'js-service']);

gulp.task('js-index', () => {
	return gulp.src(['./index.js', './*.wasm'])
		.pipe(webpack({
			entry: "./index.js",
			output: {
				filename: "index.js"
			},
			mode: "production"
		}, require("webpack")))
		.pipe(gulp.dest(dest));
});

gulp.task('js-service', () => {
	return gulp.src(['./service.js'])
		.pipe(webpack({
			entry: "./service.js",
			output: {
				filename: "service.js"
			},
			mode: "production"
		}, require("webpack")))
		.pipe(gulp.dest(dest));
});

gulp.task('assets', ['css', 'html'], () => {
	return gulp.src([
		'logo.svg',
		'./icons/*',
		'robots.txt'
	])
		.pipe(gulp.dest(dest));
});

gulp.task('css', ['less'], function () {
	return gulp.src('./*.css')
		.pipe(mincss())
		.pipe(gulp.dest(dest));
});

gulp.task('less', function () {
	return gulp.src('./*.less')
		.pipe(less())
		.pipe(gulp.dest('.'));
});

var FAVICON_DATA_FILE = 'faviconData.json';
gulp.task('favicons', function (done) {
	favicon.generateFavicon({
		masterPicture: './favicon.png',
		dest: './icons',
		iconsPath: '/aqablerweb/',
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
	}, function () {
		done();
	});
});

gulp.task('html', ['favicons'], () => {
	return gulp.src(['index.html'])
		.pipe(favicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(minhtml({collapseWhitespace: true}))
		.pipe(gulp.dest(dest));
});
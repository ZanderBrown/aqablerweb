const gulp = require('gulp');
const webpack = require('webpack-stream');
const less = require('gulp-less');
const favicon = require('gulp-real-favicon');
const fs = require('fs');

const dest = './docs/';

gulp.task('default', ['js', 'html', 'assets']);

gulp.task('js', () => {
	return gulp.src(['./*.js', './*.wasm'])
		.pipe(webpack({
			entry: "./index.js",
			output: {
				filename: "index.js",
			},
			mode: "production"
		}, require("webpack")))
		.pipe(gulp.dest(dest));
});

gulp.task('assets', ['less'], () => {
	return gulp.src([
		'logo.svg',
		'style.css',
		'./icons/*'
	])
		.pipe(gulp.dest(dest));
});

gulp.task('less', function () {
	return gulp.src('./*.less')
		.pipe(less())
		.pipe(gulp.dest('.'));
});

var FAVICON_DATA_FILE = 'faviconData.json';
gulp.task('generate-favicon', function (done) {
	favicon.generateFavicon({
		masterPicture: './favicon.png',
		dest: './icons',
		iconsPath: '/',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#0000ff',
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
				backgroundColor: '#0000ff',
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
				themeColor: '#0000ff',
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
				themeColor: '#0000ff'
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

gulp.task('html', () => {
	return gulp.src(['index.html'])
		.pipe(favicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest(dest));
});
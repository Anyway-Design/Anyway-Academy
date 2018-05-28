var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var cdnUrl = [
	[ '<link rel=\"stylesheet\" href=\"assets/fonts.css\" />', '' ],
	[ 'assets/in-view.min.js', 'https://s.anw.red/js/in-view.min.js' ],
	[ 'assets/', 'https://s.anw.red/anyway.academy/' ]
];

var fontUrl = [
	[ 'fonts/', 'https://s.anw.red/anyway.academy/' ]
];


gulp.task('default', function() {
	gulp.src(['index.html','*.php'])
		.pipe(plugins.fontSpider({ignore: ['assets/fonts.css','https://s.anw.red/css/fontello.css']}));

	gulp.src(['*.html','*.php'])
		.pipe(plugins.cacheBust({
			type: 'MD5',
			basePath: './'
		}))
		.pipe(plugins.deleteLines({
      'filters': [

			/<link(.*?)fonts(.*?)>/i
      ]
    }))
		.pipe(plugins.batchReplace(cdnUrl))
		.pipe(plugins.htmlMinifier({
			collapseWhitespace: true,
			removeComments: true,
			minifyJS: true
		}))
		.pipe(gulp.dest('builds'));

	gulp.src('assets/fonts/*.*')
    .pipe(gulp.dest('builds'));

	gulp.src('*.svg')
    .pipe(plugins.svgo())
    .pipe(gulp.dest('builds'));

	gulp.src('assets/*.css')
		.pipe(plugins.concat('v2.css'))
		.pipe(plugins.batchReplace(fontUrl))
		.pipe(plugins.cleanCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('builds'));
});

gulp.task('watch', function() {
	gulp.watch(['*','*/*'], ['default']);
});

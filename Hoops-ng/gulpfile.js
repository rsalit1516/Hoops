var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var uglify = require('gulp-uglify');
var ts = require("gulp-typescript");

var $ = require('gulp-load-plugins')({ lazy: true });
var tsProject = ts.createProject("tsconfig.json");

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', function() {
    log('Compiling Sass --> css');

    return gulp.
        src(config.sass,  { base: "./" })
        .pipe($.plumber())
        .pipe($.sass())
        .on('error', errorLogger)
        .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        //.pipe(gulp.dest(config.temp));
        .pipe(gulp.dest('.'));
});

gulp.task('fonts', function () {
    log('Building fonts');
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('compress', function () {
    var options = {
        preserveComments: 'license',
    mangle: true    
  };

    return gulp.src( './app/**/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest(config.build));
});
    
gulp.task('images', function () {
    log('Copying and Optimizing images');

    return gulp.
        src(config.images)
        .pipe($.imagemin({ optimizationlevel: 3 }))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-fonts', function(done) {
    clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function(done) {
    clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-styles', function(done) {
    clean(config.temp + '**/*.css', done);
});

gulp.task('clean-code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files, done);
});

gulp.task('sass-watcher', function () {
    gulp.watch([config.sass], ['styles']);
});

gulp.task("typescript", function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("."));
});

gulp.task('templatecache', function () {
    log("Creating Angular template cache");

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options))
        .pipe(gulp.dest(config.temp));
});

gulp.task('wiredep', function () {
    log("wire up the bower css, js and our app js into the html");
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function () {
    log("wire up the app css and call wiredep");
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp.src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});
gulp.task('scripts', function() {
   var options = {
       preserveComments: 'license',
    mangle:true   
  };

    return gulp.src('./app/**/*.js')
    // .pipe($.concat('main.js'))
    // .pipe(gulp.dest('dist/assets/js'))
      // .pipe($.rename({suffix: '.min'}))

      .pipe($.uglify(options))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe($.notify({ message: 'Scripts task complete' }));
});

gulp.task('optimize',  function () {
    log('Optimizing the javascript, css, html');

    //var assets = $.useref.assets({ searchPath: './' });
    var assets = $.useref();
    var templateCache = config.temp + config.templateCache.file;
    var cssFilter = $.filter('**/*.css', {restore:true});
    var jsFilter = $.filter('**/*.js');
 var options = {
       preserveComments: 'license',
    mangle:true   
  };
    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache, { read: false }), {
            starttag: '<!-- inject:templates:js -->'
        }))
         .pipe(assets)
         .pipe(cssFilter)
         .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(jsFilter)
        .pipe($.uglify(options))
        .pipe(assets.restore)
         .pipe(assets.restore)
         .pipe($.userref())
        .pipe(gulp.dest(config.build));
});
//////////////////////////

function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.yellow(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.yellow(msg));
    }
}

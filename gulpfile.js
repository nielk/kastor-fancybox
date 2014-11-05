var gulp        = require('gulp'),
    del         = require('del'),
    jshint      = require('gulp-jshint'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    mocha       = require('gulp-mocha'),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat');

// project paths
var path = {
    src:  './src',
    dist: './dist',
    libs: './libs',
    tmp:  './tmp',
    test: './test'
};

// Clean
gulp.task('clean', function(cb) {
    del([path.dist + '/*', path.tmp + '/*'], cb)
});


/**
 * @name: Javascript taks
 * @doc:  I created several tasks for javascript
 * first of all, I concated javascript sources files
 * (=> src.js) and then I concated it with the concated files
 * of libraries (=> lib.js), src.js + lib.js = app.js
 * I proceed that way because I didn't want to Jshint libraries.
 **/

/**
 * @name: Javascript source concat
 * @doc:  I concated the src/*.js files
 * and copied the result into ./tmp
 **/
gulp.task('javascript-source', function() {
    return gulp.src([
        path.src + '/Kastor.js',
        path.src + '/app.js'
        ])
        .pipe(concat('src.js'))
        .pipe(gulp.dest(path.tmp));
});

/**
 * @name: Javascript libs concat
 * @doc:  It concats the libs/xxx/*.js files
 * and copy the result into ./tmp
 **/
gulp.task('javascript-libs', function() {
    return gulp.src([
        path.libs + '/lodash/dist/lodash.min.js'
        ])
        .pipe(concat('libs.js', {newLine: ';'}))
        .pipe(gulp.dest(path.tmp));
});

/**
 * @name: Javascript concat
 * @doc:  It runs 'javascript-source' & 
 * 'javascript-libs' tasks then it concats 
 * the libs.js and src.js and copy 
 * the result into ./dist
 **/
gulp.task('javascript-concat', [
        'javascript-source',
        'javascript-libs'
        ], function() {
    return gulp.src(path.tmp + '/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path.dist))
        .pipe(reload({stream:true}));
});

gulp.task('jslint', function() {
  return gulp.src(path.src + '/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('sass', function () {
    gulp.src(path.src + '/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(path.dist))
        .pipe(reload({stream:true}));
});

/**
 * @name: Template taks
 * @doc:  just copy html files 
 * from src/ into /dist
 **/
gulp.task('template', function(){
    gulp.src(path.src + '/*.html')
        .pipe(gulp.dest(path.dist))
        .pipe(reload({stream:true}));
});

/**
 * @name: Libraries taks
 * @doc:  just copy libs files 
 * from libs/ into /dist/libs
 **/
gulp.task('libraries', function(){
    gulp.src(path.libs + '/**.*')
        .pipe(gulp.dest(path.dist + '/libs'))
        .pipe(reload({stream:true}));
});

/**
 * @name: Fonts taks
 * @doc:  just copy fonts files 
 * from src/ into /dist
 **/
gulp.task('fonts', function(){
    gulp.src(path.src + '/icomoon/**/*')
        .pipe(gulp.dest(path.dist + '/icomoon'))
        .pipe(reload({stream:true}));
});

/**
 * Test with Mocha
 **/
gulp.task('test', function () {
    return gulp.src(path.test + '/*.test.js')
        .pipe(gulp.dest(path.dist + '/test/'))
        .pipe(reload({stream:true}));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: path.dist + '/'
        },
        open: false
    });
});

gulp.task('watch', function() {

    // html watch
    gulp.watch(path.src + '/index.html', ['template']);

    gulp.watch(path.src + '/test.html', ['test']);

    gulp.watch(path.src + '/**/*.scss', ['sass']);

    // javascript watch
    gulp.watch([
        path.src + '/**/*.js', // javascript sources
        path.libs + '/**/*.js' // javascript libs
    ], ['jslint', 'test', 'javascript-concat']);

    // test watch
    gulp.watch(path.test + '/*.test.js', ['test']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('template');
    gulp.start('javascript-concat');
    gulp.start('jslint');
    gulp.start('sass');
    gulp.start('fonts');
    gulp.start('libraries');
    gulp.start('test');
    gulp.start('browser-sync');
    gulp.start('watch');
});
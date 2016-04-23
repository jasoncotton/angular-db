var gulp = require('gulp');
var gutil = require('gulp-util');
var Server = require('karma').Server;

gulp.task('default', function() {
    // place code for your default task here
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function () {
        done();
    }).start();
});
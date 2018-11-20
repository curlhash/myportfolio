var gulp = require('gulp');
var path = require("path");
var runSequence = require('run-sequence');

var srcAllFiles = path.join('src', '**', '*');
var dist = path.join('dist');

gulp.task('clean', function () {
	var clean = require('del');
	return clean(dist);
});

gulp.task('build', function(){
	return gulp.src(srcAllFiles)
		.pipe(gulp.dest(dist));
});

gulp.task('build-site', function(callback){
	return runSequence(
		'clean',
		'build',
		callback);
});

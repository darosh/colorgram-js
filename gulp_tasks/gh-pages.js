var merge = require('merge2');

module.exports = function (gulp, plugins) {
	return function () {
		return merge([
			gulp.src('dist/*').pipe(gulp.dest('deploy/dist')),
			gulp.src('test/images/*').pipe(gulp.dest('deploy/test/images')),
			gulp.src('test/browser_test.html').pipe(gulp.dest('deploy/test'))
		], gulp.src('deploy/**/*').pipe(plugins.ghPages({message: 'update', cacheDir: 'temp/deploy'})));
	};
};

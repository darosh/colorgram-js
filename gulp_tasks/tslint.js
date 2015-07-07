module.exports = function (gulp, plugins) {
    return function () {
        return gulp.src('src/*.ts')
            .pipe(plugins.tslint())
            .pipe(plugins.tslint.report('verbose'));
    };
};

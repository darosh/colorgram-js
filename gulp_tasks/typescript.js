var merge = require('merge2');

module.exports = function (gulp, plugins) {
    return function () {
        var result = gulp.src('src/*.ts')
            .pipe(plugins.typescript({
                module: 'commonjs',
                target: 'ES5',
                noImplicitAny: true,
                declarationFiles: true,
                out: 'colorgram.js'
            }));

        return merge([
            result.js.pipe(gulp.dest('dist')),
            result.dts.pipe(gulp.dest('.'))
        ]);
    };
};

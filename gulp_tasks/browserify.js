var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

module.exports = function (gulp, plugins) {
    return function () {
        var b = browserify({
            entries: 'dist/colorgram.js',
            debug: false,
            standalone: 'Colorgram'
        });

        return b.bundle()
            .pipe(source('dist/colorgram.js'))
            .pipe(plugins.rename('colorgram.js'))
            .pipe(gulp.dest('dist'))
            .pipe(plugins.rename('colorgram.min.js'))
            .pipe(buffer())
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.uglify())
            .on('error', plugins.util.log)
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest('dist'));
    };
};

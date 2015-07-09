module.exports = function (gulp, plugins) {
    return function () {
        return gulp
            .src('src/**/*.ts')
            .pipe(plugins.typedoc({
                module: 'commonjs',
                out: 'deploy/doc',
                mode: 'file',
                name: 'Colorgram',
                readme: 'none'
            }));
    };
};

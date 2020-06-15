module.exports = function() {
    var client = '';
    var clientApp = './app/';
    var temp = './tmp/';

    var config = {
        temp: temp,


        //all js
        alljs: [
            './app/**/*.js'
        ],
        build: './app/',
        client: client,
        css: temp + 'styles.css',
        fonts: './node_modules/font-awesome/fonts/**/*.*',
        htmltemplates: clientApp + '**/*.html',
        images: './images/**/*.*',
        index: 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        sass: './content/*.scss',

        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }
        },

        browserReloadDelay: 1000,

        // bower: {
        //     json: require('./bower.json'),
        //     directory: './bower_components',
        //     ignorePath: '../..'
        // }
    };


    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    }

    return config;
};
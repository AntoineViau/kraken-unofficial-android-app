var gulp = require('gulp'),
htmlGlob = require('gulp-html-glob-expansion'),
jshint = require('gulp-jshint'),
rename = require('gulp-rename'),
print = require('gulp-print'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
inject = require("gulp-inject"),
preprocess = require('gulp-preprocess'),
del = require('del');

gulp.task('globbing', function () {
    return gulp.src('./src/index.html')
    .pipe(htmlGlob({root: './src/'}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('www'));
});

gulp.task('jsHint', function () {
    return gulp.src([
        'src/app/**/*.js',
        'src/core/**/*.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('processCss', function () {
    return gulp.src(['./src/vendor/ionic/css/ionic.min.css', './src/app/**/*.css'])
    .pipe(concat('kraken.css'))
    .pipe(gulp.dest('./www/css'));
});

gulp.task('processImages', function () {
    return gulp.src('./res/img/*')
    .pipe(gulp.dest('./www/img'));
});

gulp.task('processFonts', function () {
    return gulp.src('./src/vendor/ionic/fonts/*')
    .pipe(gulp.dest('./www/fonts'));
});

gulp.task('concatAndCompactJs', ['jsHint'], function () {
    return gulp.src([
        'src/vendor/ionic/js/ionic.bundle.js',
        'src/vendor/cryptojs/rollups/sha256.js',
        'src/vendor/cryptojs/rollups/sha512.js',
        'src/vendor/cryptojs/rollups/hmac-sha512.js',
        'src/vendor/cryptojs/rollups/md5.js',
        'src/vendor/cryptojs/components/core.js',
        'src/vendor/cryptojs/components/enc-base64.js',
        'src/app/**/*.js',
        'src/core/**/*.js'
    ])
    .pipe(concat('kraken.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./www/js'));
});

gulp.task('processIndexForProd', function () {
    return gulp.src('./src/index.html')
    .pipe(preprocess({context: {NODE_ENV: 'production'}}))
    .pipe(inject(gulp.src(['./src/app/**/*.html']), {
        starttag: '<!-- inject:partials:{{ext}} -->',
        transform: function (filePath, file) {
            var url = filePath.substring(('/src/').length);
            return '<script id="' + url + '" type="text/ng-template">\n' + file.contents.toString('utf8') + '\n</script>';
        }
    }))
    .pipe(preprocess({context: {NODE_ENV: 'production'}}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./www'));
});


gulp.task('processIndexForDev', function () {
    return gulp.src('./src/index.html')
    .pipe(htmlGlob({root: './src/'}))
    .pipe(preprocess({context: {NODE_ENV: 'dev'}}))
    .pipe(inject(gulp.src(['./src/app/**/*.html']), {
        starttag: '<!-- inject:partials:{{ext}} -->',
        transform: function (filePath, file) {
            var url = filePath.substring(('/src/').length);
            return '<script id="' + url + '" type="text/ng-template">\n' + file.contents.toString('utf8') + '\n</script>';
        }
    }))
    .pipe(preprocess({context: {NODE_ENV: 'dev'}}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./www'));
});

gulp.task('clean', function (cb) {
    return del(['www/*'], cb);
});

gulp.task('copyApp', function () {
    return gulp.src(['./src/app/**/*', './src/core/**/*', './src/vendor/**/*'], {base: './src/'})
    .pipe(gulp.dest('./www'));
});

gulp.task('release', ['clean'], function () {
    gulp.start('jsHint', 'concatAndCompactJs', 'processCss', 'processImages', 'processFonts', 'processIndexForProd');
});

gulp.task('debug', function () {
    gulp.start('jsHint', 'copyApp', 'processImages', 'processFonts', 'processIndexForDev');
});

gulp.task('default', function () {
    gulp.watch(['./src/*', './src/**/*'], ['debug']);
});
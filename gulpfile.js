var gulp      = require('gulp'),
    del       = require('del'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    fs        = require('fs')
    ;

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

gulp.task('clean', function (callback) {
    del('deploy/**', callback);
});


gulp.task('build-js', ['clean'], function() {
    return gulp.src(
            [
                './src/lib/*.js',
                './src/js/sucodonamespace.js',
                './src/js/*.js',
                '!./src/js/tests.js'
            ]
        )
        .pipe(concat('sucodo.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./deploy/separated/js'))
        ;
});

gulp.task('build-html', ['clean'], function() {
    return gulp.src(
            [
                './src/html/*.html'
            ]
        )
        .pipe(concat('sucodo.html'))
        .pipe(gulp.dest('./deploy/separated/html'))
        ;
});

gulp.task('build-css', ['clean'], function() {
    return gulp.src('./src/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./deploy/separated/css'));
});

gulp.task('build-download-release', ['clean', 'build-js', 'build-html', 'build-css'], function(callback) {
    var sHtmlTemplate = '<!DOCTYPE HTML>' +
        '<html><head><meta charset="UTF-8"><title>sucodo</title><style>#style#</style><script>#code#</script>' +
        '</head><body>#html#<script>Sucodo.Loca.setLang(#loca_code#);</script></body></html>';
    fs.readFile( __dirname + '/deploy/separated/css/sucodo.css', function (err, data) {
        if (err) {
            throw err;
        }
        sHtmlTemplate = sHtmlTemplate.replace('#style#', data.toString());

        fs.readFile( __dirname + '/deploy/separated/js/sucodo.js', function (err, data) {
            if (err) {
                throw err;
            }
            sHtmlTemplate = sHtmlTemplate.replace('#code#', data.toString());

            fs.readFile( __dirname + '/src/html/sucodo.html', function (err, data) {
                if (err) {
                    throw err;
                }
                sHtmlTemplate = sHtmlTemplate.replace('#html#', data.toString());

                var folder = __dirname + '/deploy/download-release/';
                mkdirSync(folder);
                var folderEn = folder + 'en/';
                mkdirSync(folderEn);
                sHtmlTemplateEn = sHtmlTemplate.replace('#loca_code#', 'Sucodo.LOCA_ENG');
                fs.writeFileSync(folderEn + 'sucodo.html', sHtmlTemplateEn);
                var folderDe = folder + 'de/';
                mkdirSync(folderDe);
                sHtmlTemplateDe = sHtmlTemplate.replace('#loca_code#', 'Sucodo.LOCA_GER');
                fs.writeFileSync(folderDe + 'sucodo.html', sHtmlTemplateDe);
                callback();
            });
        });
    });
});

// Default task
// --------------------------------------
gulp.task('default', function () {
    gulp.start('clean', 'build-js', 'build-html', 'build-css', 'build-download-release');
});
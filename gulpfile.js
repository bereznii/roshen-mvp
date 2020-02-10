/* jshint esversion: 6 */

const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const uglifyes     = require('uglify-es');
const composer     = require('gulp-uglify/composer');
const uglify       = composer(uglifyes, console);
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const browserSync  = require('browser-sync').create();
// const pug          = require('gulp-pug');
const sass         = require('gulp-sass');
const rimraf       = require('gulp-rimraf');
const rename       = require('gulp-rename');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const buffer       = require('vinyl-buffer');
const cache        = require('gulp-cache');
const spritesmith  = require('gulp.spritesmith');
const sourcemaps   = require('gulp-sourcemaps');
// const concat       = require('gulp-concat');
// const babel        = require('gulp-babel');
const babelify     = require('babelify');
const through2     = require('through2');
const browserify   = require('browserify');

// const realFavicon = require ('gulp-real-favicon');
// const fs = require('fs');
// const FAVICON_DATA_FILE = './source/faviconData.json';

const path = {
    build: {
        html:      'public/',
        css:       'public/css/',
        js:        'public/js/',
        sprite:    'public/img/',
        spriteRel: '/img/',
        spriteCSS: 'resources/sass/partial/',
        img:       'public/img/',
        fonts:     'public/fonts/'
    },
    src: {
        template:  'resources/template/*.*',
        style:     'resources/sass/*.scss',
        js:         ['resources/js/**/*.js'],
        sprite:    'resources/sass/icons/**/*.*',
        img:       'resources/img/**/*.*',
        fonts:     'resources/fonts/**/*.*'
    },
    watch: {
        template:  'resources/template/**/*.*',
        style:     'resources/sass/**/*.scss',
        js:        'resources/js/**/*.js',
        sprite:    'resources/style/icons/**/*.*',
        img:       'resources/img/**/*.*',
        fonts:     'resources/fonts/**/*.*'
    },
    clean: {
        css:       'public/css',
        js:        'public/js',
        img:       'public/img',
        fonts:     'public/fonts'
    }
};

/* ----- Error handler ---- */
const onError = function (err) {
    notify.onError({
        title:    'Gulp',
        subtitle: 'Error',
        message:  err.message,
        sound: false
    })(err);
    this.emit('end');
};

/* -------- Server -------- */
gulp.task('server', function() {
    browserSync.init({
        // server: {
        //     baseDir: 'public',            
        // },
        // open: 'external',
        open: true,
        host: 'roshen',
        proxy: 'roshen'
    });
    gulp.watch('public/**/*').on('change', browserSync.reload);
    gulp.watch('resources/views/**/*').on('change', browserSync.reload);
});

/* ----------- HTML build ----------- */
// gulp.task('template:build', function buildHTML() {
//     return gulp.src(path.src.template)
//         .pipe(gulp.dest(path.build.html));
// });

/* ------------- Pug build -------------- */
gulp.task('template:build', function buildHTML() {
    return gulp.src(path.src.template)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(pug({
            pretty: '    '
        }))
        // .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest(path.build.html));
});

/* ------------ Style build ------------- */
gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        // .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer({
            cascade: false,
            add: true
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.css));
});

/* --------- JavaScript build ----------- */
gulp.task('js:build', function () {
    return gulp.src(path.src.js, { allowEmpty: true/*, read: false*/ }) // {read: false} for browserify
        .pipe(plumber({ errorHandler: onError }))
        .pipe(through2.obj(function (file, enc, next){
            browserify(file.path, {debug: true})
                .transform('babelify', {
                    presets: ['@babel/preset-env'],
                    sourceMaps: true
                })
                .bundle(function(err, res = null){
                    file.contents = res;
                    next(null, file);
                })
                .on('error', function(err) {
                    console.error('Error from browserify,', err.toString());
                })
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(concat('main.js'))
        // .pipe(babel({presets: ['@babel/preset-env']}))
        .pipe(uglify().on('error', function(err) {
            console.error('Error from uglify,', err.toString());
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.js));
});

/* ----------- Images build ------------- */
gulp.task('image:build', function() {
    return gulp.src(path.src.img)
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false}
                ]
            })
        ], {
            use: [pngquant({quality: '80-90', speed: 4})]
        })))
        .pipe(gulp.dest(path.build.img));
});

/* --------------- Sprite ---------------- */
gulp.task('sprite:build', function(cb) {
    const spriteData = gulp.src(path.src.sprite).pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: path.build.spriteRel + 'sprite.png',
        /* ----- retina config ----- */
        retinaSrcFilter: ['**/*@2x.png'],
        retinaImgName: 'sprite@2x.png',
        retinaImgPath: path.build.spriteRel + 'sprite@2x.png',
        /* --- end retina config --- */
        cssName: '_sprite.scss',
        cssVarMap: function(sprite) {
                    sprite.name = 'icon-' + sprite.name;
        },
        algorithm: 'binary-tree',
        padding: 2
    }));
    spriteData.img
        .pipe(buffer())
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false}
                ]
            })
        ], {
            use: [pngquant({quality: '80-90', speed: 4})]
        }))
        .pipe(gulp.dest(path.build.sprite));
    spriteData.css
        .pipe(gulp.dest(path.build.spriteCSS));
    cb();
    return spriteData;
});

/* ------------- Copy fonts -------------- */
gulp.task('fonts:copy', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

/* ---------- Generate Favicon ----------- */
// gulp.task('generate-favicon', function(done) {
//     realFavicon.generateFavicon({
//         masterPicture: 'source/favicon.png',
//         dest: 'source/img/favicons/',
//         iconsPath: '/img/favicons/',
//         design: {
//             ios: {
//                 pictureAspect: 'backgroundAndMargin',
//                 backgroundColor: '#ffe300',
//                 margin: '35%',
//                 assets: {
//                     ios6AndPriorIcons: false,
//                     ios7AndLaterIcons: false,
//                     precomposedIcons: false,
//                     declareOnlyDefaultIcon: true
//                 }
//             },
//             desktopBrowser: {},
//             windows: {
//                 pictureAspect: 'whiteSilhouette',
//                 backgroundColor: '#ffc40d',
//                 onConflict: 'override',
//                 assets: {
//                     windows80Ie10Tile: false,
//                     windows10Ie11EdgeTiles: {
//                         small: false,
//                         medium: true,
//                         big: false,
//                         rectangle: false
//                     }
//                 }
//             },
//             androidChrome: {
//                 pictureAspect: 'backgroundAndMargin',
//                 margin: '25%',
//                 backgroundColor: '#ffe300',
//                 themeColor: '#ffe300',
//                 manifest: {
//                     name: 'roshen',
//                     display: 'standalone',
//                     orientation: 'notSet',
//                     onConflict: 'override',
//                     declared: true
//                 },
//                 assets: {
//                     legacyIcon: false,
//                     lowResolutionIcons: false
//                 }
//             },
//             safariPinnedTab: {
//                 pictureAspect: 'silhouette',
//                 themeColor: '#2197d7'
//             }
//         },
//         settings: {
//             scalingAlgorithm: 'Mitchell',
//             errorOnImageTooSmall: false,
//             readmeFile: false,
//             htmlCodeFile: false,
//             usePathAsIs: false
//         },
//         markupFile: FAVICON_DATA_FILE
//     }, function() {
//         done();
//     });
// });

/* --------------- Delete ---------------- */
gulp.task('clean', function del(cb) {
    const cleanArr = [];
    for (let key in path.clean) {
        cleanArr.push(path.clean[key]);
    }
    return gulp.src(cleanArr, { read: false, allowEmpty: true })
        .pipe(rimraf());
});

/* -------------- Watchers --------------- */
gulp.task('watch', function() {
    // gulp.watch(path.watch.template, gulp.series('template:build'));
    gulp.watch(path.watch.style, gulp.series('style:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:copy'));
    gulp.watch(path.watch.sprite, gulp.series('sprite:build'));
});

/* --------------- Build ----------------- */
gulp.task('build', gulp.series(
    'clean',
    // 'generate-favicon',
    gulp.parallel(
        // 'template:build',
        'style:build',
        'sprite:build',
        'js:build',
        'image:build',
        'fonts:copy'
    )
));

/* -------------- Default ---------------- */
gulp.task('default', gulp.series(
    'build',
    gulp.parallel('watch', 'server')
));
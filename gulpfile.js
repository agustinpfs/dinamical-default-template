var gulp = require('gulp')
var browserify = require('browserify')
var jadeify = require('jadeify')
var babelify = require('babelify')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var stylus = require('gulp-stylus')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var watchify = require('watchify')
var assign = require('lodash.assign')
var livereload = require('gulp-livereload')
var postcss = require('gulp-postcss')
var cssnext = require('postcss-cssnext')
var poststylus = require('poststylus')
var mqpacker = require('css-mqpacker')
var csswring = require('csswring')
var browserSync = require('browser-sync').create()
var remoteSrc = require('gulp-remote-src')

browserify().transform(babelify.configure({
  presets: ['es2015'],
  plugins: ['transform-async-to-generator', 'syntax-async-functions', 'transform-regenerator']
}))

browserify().transform(babelify, {presets: ['es2015'], plugins: ['syntax-async-functions', 'transform-regenerator']})

var client_opts = {
  entries: './lib/index.js', // punto de entrada js
  transform: [ babelify, jadeify ] // transformaciones
}

client_opts = assign({}, watchify.args, client_opts)

gulp.task('build', ['client_styl', 'client_js'])
gulp.task('default', ['build'])

gulp.task('client_js', function () {
  return client_generateBundle(browserify(client_opts))
})

gulp.task('client_styl', function () {
  return client_styl()
})

gulp.task('client_styl:livereload', function () {
  return client_styl().pipe(livereload({ start: true }))
})

gulp.task('client_styl:watch', function () {
  return gulp.watch(['./lib/styles.styl', './lib/**/*.styl'], ['client_styl:livereload'])
})

gulp.task('client_js:watch', function () {
  var w = watchify(browserify(client_opts))

  w.on('update', function (file) {
    console.log('file modified, rebuilding: ', file)

    var bdle = client_generateBundle(w).pipe(livereload())
    console.log('rebuild finished')
    return bdle
  })

  // livereload es un Singleton
  return client_generateBundle(w).pipe(livereload({ start: true }))
})

gulp.task('client_watch', ['client_styl:watch', 'client_js:watch'])
gulp.task('watch', ['client_watch'])

function client_styl () {
  // var processors = [
  //     poststylus,
  //     cssnext({ browsers: ['> 5%', 'ie 8']})
  // ]

  return gulp.src('./lib/styles.styl') // entry point de styl
    // .pipe(stylus({ use: nib() })) //inicializo stylus con nib como plugin
    // .pipe(concat('client.css'))
    // .pipe(cleanCSS())
    .pipe(stylus({
      use: [
        poststylus([
          cssnext({browsers: ['> 5%', 'ie 8']}), // lo ultimo de css hoy
          mqpacker(), // media queries al final
          csswring() // minificado
        ])
      ]
    }))
    // .pipe(postcss(processors))
    .pipe(rename('template.min.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
}

function client_generateBundle (b) {
  return b
  .bundle()
  .pipe(source('template.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(rename('template.min.js'))
  .pipe(gulp.dest('./dist'))
}
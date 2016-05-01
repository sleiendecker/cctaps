'use strict';

import gulp from 'gulp';
import shell from 'gulp-shell';
import rimraf from 'rimraf';
import run from 'run-sequence';
import plumber from 'gulp-plumber';
import watch from 'gulp-watch';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import minifyCss from 'gulp-minify-css';
import gutil from 'gulp-util';
import nodemon from 'gulp-nodemon';
import server from 'gulp-live-server';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';
import webpackDevConfig from './webpack.config.dev';

const paths = {
  serverJS    : ['./src/server/**/*.js'],
  serverDest  : './src/server/index.js',
  clientJS    : ['./src/client/**/*.js'],
  clientDest  : './app',
  sassSrc     : ['./src/sass/**/*.scss'],
  sassDest    : './app'
};

/**
 * Server commands
 */

gulp.task('build', cb => {
  run('clean-client', 'webpack', 'sass', cb);
});
gulp.task('deploy', shell.task([ 'forever start -c "node --harmony" src/server/index.js' ]));
gulp.task('stop', shell.task([ 'forever stopall' ]));

/**
 * Development tasks
 */

gulp.task('default', cb => {
  run('build-dev', cb);
});

gulp.task('build-dev', cb => {
  run('server', 'clean-client', 'sass', 'webpack', 'webpack-dev-server', 'watch-sass', cb);
});

gulp.task('clean-client', cb => {
  rimraf(paths.clientDest, cb);
});

gulp.task('flow', shell.task([
  'flow'
], { ignoreErrors: true }));

gulp.task('sass', cb => {
  gulp.src(paths.sassSrc)
  .pipe(plumber())
  .pipe(sass())
  .pipe(concat('style.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest(paths.sassDest))
  cb();
});

gulp.task('webpack', cb => {
  webpack(webpackConfig, (err, stats) => {
    if(err) {
      console.log('*** WEBPACK MESSED UP :( ****');
      console.log(err);
      process.exit(1);
    }

    console.log('*** WEBPACKING ***');
    cb();
  });
});

gulp.task('webpack-dev-server', () => {
  var compiler = webpack(webpackDevConfig);

  // todo: verify this
  return new WebpackDevServer(compiler, {
    proxy: {
      '*': 'http://localhost:3000'
    },
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0'
  }).listen(3001, 'localhost', err => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);

    gutil.log('[webpack-dev-server]', 'http://localhost:3000/webpack-dev-server/index.html');
  });
});

gulp.task('server', () => {
  nodemon({
    script: paths.serverDest,
    ext: 'js',
    execMap: {
      js: "node --harmony"
    },
    watch: ['./src/server']
  }).on('restart', () => {
    console.log('*** NODEMON RESTARTED ***');
  });
});

/**
 * Watch tasks
 */

gulp.task('watch-webpack', cb => {
  gulp.watch(['src/client/**/*.*'], ['webpack']);
  cb();
});

gulp.task('watch-sass', cb => {
  gulp.watch(['src/sass/**/*.*'], ['sass']);
  cb();
});
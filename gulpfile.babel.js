'use strict';

import gulp from 'gulp';
import shell from 'gulp-shell';
import rimraf from 'rimraf';
import run from 'run-sequence';
import watch from 'gulp-watch';
import gutil from 'gulp-util';
import nodemon from 'gulp-nodemon';
import server from 'gulp-live-server';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';

const paths = {
  serverJS    : ['./src/server/**/*.js'],
  serverDest  : './src/server/index.js',
  clientJS    : ['./src/client/**/*.js'],
  clientDest  : './app'
};

let express;

gulp.task('default', cb => {
  run('server', 'build', 'watch-webpack', cb);
});

gulp.task('build', cb => {
  run('clean-client', 'webpack', cb);
});

gulp.task('build-dev', cb => {
  run('clean-client', 'flow', 'webpack-dev-server', cb);
});

gulp.task('clean-client', cb => {
  rimraf(paths.clientDest, cb);
});

gulp.task('flow', shell.task([
  'flow'
], { ignoreErrors: true }));

gulp.task('webpack', cb => {
  webpack(webpackConfig, (err, stats) => {

    if(err) {
      console.log('*** WEBFUDGEPACK MESSED UP :( ****');
      console.log(err);
      process.exit(1);
    }

    console.log('*** WEBFUDGEPACKING ***');
    cb();
  });
});

gulp.task('webpack-dev-server', () => {
  var compiler = webpack(webpackConfig);

  // todo: verify this
  return new WebpackDevServer(compiler, {
    publicPath: 'http://localhost:3000/',
    hot: true,
    host: 'localhost'
  }).listen(3000, 'localhost', err => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);

    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

gulp.task('watch-webpack', cb => {
  gulp.watch(['src/client/**/*.*'], ['webpack']);
  cb();
});

// @todo this will only be dev-server
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
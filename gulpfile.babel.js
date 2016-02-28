'use strict';

import gulp from 'gulp';
import shell from 'gulp-shell';
import rimraf from 'rimraf';
import run from 'run-sequence';
import watch from 'gulp-watch';
import gutil from 'gulp-util';
import nodemon from 'gulp-nodemon';
import server from 'gulp-live-server';
import webpack from 'webpack-stream';
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
  run('server', 'build', cb);
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

gulp.task('webpack', () => {
  return gulp.src('./src/client/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./app'));
});

gulp.task('webpack-dev-server', () => {
  var compiler = webpack(webpackConfig);

  // todo: verify this
  return new WebpackDevServer(compiler, {
    contentBase: './build/',
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    host: 'localhost'
  }).listen(8080, 'localhost', err => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);

    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

// this will only be dev-server hopefully
gulp.task('server', () => {
  nodemon({
    script: paths.serverDest,
    ext: 'js',
    execMap: {
      js: "node --harmony"
    },
    watch: ['./src/server']
    // ignore: [
    //   './src/client/',
    //   './scripts/',
    //   './node_modules',
    //   './app',
    //   './dump',
    //   './gulpfile.babel.js',
    //   './webpack.config.js'
    // ]
  }).on('restart', () => {
    console.log('*** NODEMON RESTARTED ***');
  });
});
'use strict';

import gulp from 'gulp';
import gulpPlugins from 'gulp-load-plugins';
import shell from 'gulp-shell';
import rimraf from 'rimraf';
import run from 'run-sequence';
import watch from 'gulp-watch';
import gutil from 'gulp-util';
import server from 'gulp-live-server';
import webpack from 'webpack-stream';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';

const $ = gulpPlugins({lazy: true});
const paths = {
  serverJS    : ['./src/server/**/*.js'],
  serverDest  : './app',
  clientJS    : ['./src/client/**/*.js'],
  clientDest  : './app'
};

let express;

gulp.task('default', cb => {
  run('server', 'build', 'watch', cb);
});

gulp.task('build', cb => {
  run('clean-client', 'webpack', 'restart', cb);
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

gulp.task('babel', shell.task([
  'babel src --out-dir app'
]));

gulp.task('webpack', () => {
  return gulp.src('./src/client/js/index.js')
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

gulp.task('server', () => {
  express = server.new(['--harmony', paths.serverDest]);
});

gulp.task('restart', () => {
  express.start.bind(express)();
});

// gulp.task('watch', () => {
//   return watch(paths.serverJS, () => {
//     gulp.start('build');
//   });
// });

// gulp.task('watch', () => {
//   return watch(paths.clientJS, () => {
//     gulp.start('build');
//   });
// })
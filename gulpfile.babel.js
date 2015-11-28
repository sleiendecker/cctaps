'use strict';

import gulp from 'gulp';
import gulpPlugins from 'gulp-load-plugins';
const $ = gulpPlugins({lazy: true});

gulp.task('build', () => {
  $.util.log($.util.colors.green('Shreking some builds'));
});
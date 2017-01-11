import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';

export default {
  entry: 'src/index.js',
  dest: 'dist/store.ext.min.js',
  format: 'umd',
  context: 'this',
  moduleName: 'store.ext',
  sourceMap: false,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json']
    }),
    commonjs(),
    json(),
    buble(),
    uglify({}, minify)
  ]
};

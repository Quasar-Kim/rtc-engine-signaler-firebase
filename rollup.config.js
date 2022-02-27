import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/FireBaseSignaler.js',
  output: {
    file: 'dist/FireBaseSignaler.prod.js',
    format: 'esm'
  },
  plugins: [commonjs(), nodeResolve(), terser()]
}

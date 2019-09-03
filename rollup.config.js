import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

const cwd = process.cwd()
const { main, module, meta: { namespace, external, globals, input = 'src/index.ts' } } = require(`${cwd}/package.json`)

export default {
  input,

  output: [
    { file: `${cwd}/${main}`, name: namespace, format: 'umd', sourcemap: true, globals },
    { file: `${cwd}/${module}`, format: 'es', sourcemap: true, globals }
  ],

  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external,

  watch: {
    include: 'src/**',
  },

  plugins: [
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true, clean: true, cacheRoot: 'node_modules/.rts2_cache' }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}

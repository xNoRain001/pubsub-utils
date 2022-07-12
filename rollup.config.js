import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',

  output: {
    file: './dist/event-bus.js',
    format: 'umd',
    name: 'EventBus'
  },
  
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
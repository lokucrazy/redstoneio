const { build } = require('esbuild')

const options = {
  stdio: 'inherit',
  entryPoints: ['./src/index.ts'],
  outfile: './build/bundle.js',
  target: 'es2016',
  minify: false,
  bundle: true,
}

build(options).catch(() => process.exit(1))
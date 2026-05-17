require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    moduleResolution: 'node'
  }
});
require('./simulate_local.ts');

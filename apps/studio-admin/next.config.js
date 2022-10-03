const withTM = require('next-transpile-modules')(['ui'])
const withLess = require('next-with-less')

module.exports = withTM(
  withLess({
    reactStrictMode: true,
    compiler: {
      emotion: true,
    },
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: {
          'primary-color': '#b736d0',
          'border-radius-base': '2px',
          /* ... */
        },
      },
    },
  })
)

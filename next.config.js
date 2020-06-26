const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = withCSS(
  withSass((phase, { defaultConfig }) => {
    return {
      compress: phase === PHASE_DEVELOPMENT_SERVER,
      api: {
        externalResolver: true,
      },
      poweredByHeader: false,
      cssModules: false,
    }
  })
)

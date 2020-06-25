const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  return {
    compress: phase === PHASE_DEVELOPMENT_SERVER,
    api: {
      externalResolver: true,
    },
    poweredByHeader: false,
  }
}

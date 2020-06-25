'use strict'

const { join } = require('path')

const rootDir = process.env.ROOT_DIR

module.exports = {
  // https
  SSL: {
    enable: false,
    certificate: join(rootDir, './cert/dev/server.cert'),
    certificateKey: join(rootDir, './cert/dev/server.key'),
  },
}

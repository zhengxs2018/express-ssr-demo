'use strict'

const { join, dirname } = require('path')

const rootDir = process.env.ROOT_DIR || dirname(__dirname)

module.exports = {
  // https
  SSL: {
    enable: false,
    certificate: join(rootDir, './cert/dev/server.cert'),
    certificateKey: join(rootDir, './cert/dev/server.key'),
  },
}

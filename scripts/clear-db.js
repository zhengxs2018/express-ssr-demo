/**
 * Initialize database tables. All data will be cleared.
 */
const logger = require('../app/lib/logger')

const connectDB = require('../database/connect')

logger.info('Clear database tables.')

const clearDB = async () => {
  const User = require('../app/models/User')
  const VerificationCode = require('../app/models/VerificationCode')

  // clear database tables
  await User.deleteMany({})
  await VerificationCode.deleteMany({})
}

connectDB()
  .then(clearDB)
  .then(() => {
    logger.info('All database tables are cleared')
    process.exit()
  })
  .catch(e => {
    logger.logFullError(e)
    process.exit(1)
  })

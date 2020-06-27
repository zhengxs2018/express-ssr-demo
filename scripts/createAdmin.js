/**
 * create new admin
 */
const extend = require('lodash/extend')

const logger = require('../app/lib/logger')
const { hashPassword } = require('../app/lib/utils')

const { UserRoles } = require('../constants/access')

const connectDB = require('../database/connect')
const searchEntities = require('../database/helpers/searchEntities')

async function createAdmin() {
  const User = require('../app/models/User')

  const adminObj = {
    email: 'admin@ognomy.com',
    passwordHash: await hashPassword('@Ognomy123'),
    firstName: 'System',
    lastName: 'Admin',
    roles: [UserRoles.Admin],
  }
  const admin = await searchEntities(User, { email: adminObj.email }, true)
  if (admin) {
    extend(admin, adminObj)
    await admin.save()
  } else {
    await User.create(adminObj)
  }
}

connectDB()
  .then(createAdmin)
  .then(() => {
    logger.info('create/update admin succeed')
    process.exit()
  })
  .catch(e => {
    logger.logFullError(e)
    process.exit(1)
  })

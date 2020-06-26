/**
 * Insert test data to database.
 */
const logger = require('../app/lib/logger')
const { hashPassword } = require('../app/lib/utils')

const { UserRoles } = require('../constants/access')
const { VerificationCodeTypes } = require('../constants/enums')

const connectDB = require('../database/connect')

logger.info('Insert test data into database.')

async function insertUsers() {
  const User = require('../app/models/User')

  // create users
  const passwordHash = await hashPassword('password')
  const roles = [UserRoles.Physician]

  await Promise.all([
    User.create({
      email: 'daniel.rifkin@test.com',
      firstName: 'Daniel',
      lastName: 'Rifkin',
      passwordHash,
      address: 'Buffalo, NY',
      providerInfo: {
        qualifications: ['MD', 'MPH', 'FAASM'],
        biography: `I'm the founder of the Sleep Medecine Centers of Western New York`,
      },
      roles,
      isProvider: true,
    }),
    User.create({
      email: 'yourProviderEmail@gmail.com', // Use a gmail address here for verification
      firstName: 'Topcoder',
      lastName: 'Tester',
      passwordHash,
      address: 'Buffalo, NY',
      providerInfo: {
        timeZone: 'America/New_York',
        qualifications: ['MD'],
        biography: `Expert Doctor of Medecine with 15 years of experience`,
      },
      roles,
      isProvider: true,
    }),
    User.create({
      email: 'keryn.e-gauch@test.com',
      firstName: 'Keryn',
      lastName: 'E.Gauch',
      passwordHash,
      address: 'Buffalo, NY',
      providerInfo: {
        qualifications: ['RPA-C', 'MS'],
        biography: `Multiple sclerosis expert, Registered Physician Assistant - Certified`,
      },
      roles,
      isProvider: true,
    }),
    User.create({
      email: 'marc.L-schelegel@test.com',
      firstName: 'Mark',
      lastName: 'L.Schelegel',
      passwordHash,
      address: 'Buffalo, NY',
      providerInfo: {
        qualifications: ['RPA-C', 'MS'],
        biography: `Multiple sclerosis expert, Registered Physician Assistant - Certified`,
      },
      roles,
      isProvider: true,
    }),
    User.create({
      email: 'sleepless.patient@test.com',
      passwordHash,
      roles: [UserRoles.Patient],
      isProvider: false,
    }),
  ])
}

async function insertVerificationCode() {
  const VerificationCode = require('../app/models/VerificationCode')

  await Promise.all([
    VerificationCode.create({
      type: VerificationCodeTypes.SignUp,
      email: 'admin@test.com',
      value: '123456',
      expiryDate: new Date('2020/12/31 23:59:59'),
    }),
    VerificationCode.create({
      type: VerificationCodeTypes.SignUp,
      email: 'demo@test.com',
      value: '123456',
      expiryDate: new Date('2020/12/31 23:59:59'),
    }),
  ])
}

connectDB()
  .then(() => Promise.all([insertVerificationCode(), insertUsers()]))
  .then(() => {
    logger.info('Test data created')
    process.exit()
  })
  .catch(e => {
    logger.logFullError(e)
    process.exit(1)
  })

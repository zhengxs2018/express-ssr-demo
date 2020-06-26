/**
 * This service provides security related operations
 */
const ms = require('ms')
const Joi = require('joi')
const config = require('config')
const jwt = require('jsonwebtoken')

const { Unauthorized, Conflict, BadRequest } = require('http-errors')

const isNil = require('lodash/isNil')
const omit = require('lodash/omit')

const logger = require('../lib/logger')
const { sendEmail } = require('../lib/helpers')
const { hashPassword, validatePasswordHash, isZoomBusiness } = require('../lib/utils')

const { UserRoles } = require('../../constants/access')
const { VerificationCodeTypes, BooleanStrings } = require('../../constants/enums')

const searchEntities = require('../../database/helpers/searchEntities')

const AuditLog = require('../models/AuditLog')
const User = require('../models/User')
const VerificationCode = require('../models/VerificationCode')

const { getUID } = require('./User')
const { checkPwd } = require('./admin/AdminCommon')

/**
 * check code
 * @param email the email
 * @param code the v code
 * @param type the code type
 */
async function checkCode(email, code, type) {
  const encryptedVerificationCode = new VerificationCode({ email, value: code, type })
  encryptedVerificationCode.encryptFieldsSync()

  // Get the Verification code instance from the database using the input search criteria
  const existingCode = await VerificationCode.findOne({
    email: encryptedVerificationCode.email,
    value: encryptedVerificationCode.value,
  })

  // handle invalid cases (email/verification code does not exist, or the code has expired)
  if (isNil(existingCode)) {
    throw new BadRequest('The provided email and verification code are invalid')
  }

  // Check if the verification code is not expired.
  if (new Date(existingCode.expiryDate) < new Date()) {
    throw new BadRequest('The provided verification code is expired, kindly request a new one')
  }

  // remove the verification code
  await VerificationCode.deleteOne({ email: encryptedVerificationCode.email })
}

/**
 * This functions processes the user signup operation
 *
 * @param {Object} data The object containing the email, password and verification code
 */
async function signup(data) {
  await checkCode(data.email, data.verificationCode, VerificationCodeTypes.SignUp)

  // We need to check if the user account does not already exist
  const userWithEncryptedEmail = new User({ email: data.email })
  userWithEncryptedEmail.encryptFieldsSync()

  const existingUser = await User.findOne({ email: userWithEncryptedEmail.email })
  if (isNil(existingUser)) {
    // The user account does not exist, it can be safely created.
    // create a new user account with Patient role
    const [uid, passwordHash] = await Promise.all([getUID(), hashPassword(data.password)])

    const user = new User({
      email: data.email,
      passwordHash: passwordHash,
      isProvider: BooleanStrings.False,
      roles: [UserRoles.Patient],
      uid: uid + 1,
    })

    await user.save()
  } else {
    // The user already exists
    throw new Conflict(`The user with email ${data.email} already exists`)
  }
}

signup.schema = {
  data: Joi.object().keys({
    email: Joi.email(),
    password: Joi.string().required(),
    verificationCode: Joi.string().required(),
  }),
}

/**
 * Login by email and password
 * @param {Object} credentials the credentials
 * @returns {Object} the token and user data
 */
async function login(credentials) {
  // find user by email
  const users = await searchEntities(User, { email: credentials.email })
  const createLoginAuditLog = async (role, details) => {
    await AuditLog.create({
      operator: credentials.email,
      action: 'Login',
      patientId: 'N/A',
      operatorRole: role,
      changeDetails: details,
    })
  }
  if (isNil(users[0])) {
    await createLoginAuditLog('N/A', 'Invalid credentials, User not exist')
    throw new Unauthorized('Invalid credentials')
  }
  const user = users[0]

  // compare hashed password
  const isValidPassword = await validatePasswordHash(credentials.password, user.passwordHash)
  if (!isValidPassword) {
    await createLoginAuditLog('N/A', 'Invalid credentials, Password wrong')
    throw new Unauthorized('Invalid credentials')
  }

  if (user.deleted) {
    throw new Unauthorized('User has been deleted, cannot login')
  }

  // generate JWT token
  const token = jwt.sign({ id: user._id, roles: user.roles, email: user.email }, config.get('JWT_SECRET'), {
    expiresIn: ms(config.get('ZOOM_ACCESS_TOKEN_LIFETIME')) / 1000,
  })
  await createLoginAuditLog(user.roles.join(','), 'Login succeed')

  return {
    token,
    user: {
      bindNylas: !!user.nylasAccessToken,
      bindZoom: !!user.zoomUserId,
      isZoomBusiness: isZoomBusiness(),
      ...(await checkPwd(user._id)),
      ...omit(user.toJSON(), ['passwordHash']),
      ...{ roles: user.roles },
    },
  }
}

login.schema = {
  credentials: Joi.object()
    .keys({
      email: Joi.email(),
      password: Joi.string().required(),
    })
    .required(),
}

/**
 * This private function generates a random verification code with the given length
 *
 * @param {Number} length The verification code length
 * @returns {String} The generated verification code
 */
function _generateVerificationCode(length) {
  const digits = '0123456789'
  let code = ''
  for (let i = 0; i < length; ++i) {
    code += digits[Math.floor(Math.random() * digits.length)]
  }
  return code
}

/**
 * Send verification code to user
 * @param {Object} data the data containing email
 */
async function sendVerificationCode(data) {
  // Create a user instance with encrypted email.
  const userWithEncryptedEmail = new User({ email: data.email, type: data.type })
  userWithEncryptedEmail.encryptFieldsSync()

  // Find the user with the same email
  const user = await User.findOne({ email: userWithEncryptedEmail.email })

  if (data.type === VerificationCodeTypes.SignUp && !isNil(user)) {
    throw new Conflict(`User account with email ${data.email} already exists`)
  } else if (data.type === VerificationCodeTypes.ForgotPassword && isNil(user)) {
    throw new Conflict(
      `If your email is registered with us, you will receive email instructions on how to change your password.`
    )
  }

  // Create a new verification code value
  const verificationCodeValue = await _generateVerificationCode(4)

  // Create a verification code with encrypted email
  const codeWithEncryptedEmail = new VerificationCode({ email: data.email, type: data.type })
  codeWithEncryptedEmail.encryptFieldsSync()

  // delete old verification code by email if any
  await VerificationCode.deleteOne({ email: codeWithEncryptedEmail.email, type: codeWithEncryptedEmail.type })

  // create a new verification code entry
  const verificationCode = new VerificationCode({
    value: verificationCodeValue,
    email: data.email,
    type: data.type,
    expiryDate: new Date(new Date().getTime() + ms(config.get('VERIFICATION_CODE_LIFETIME'))),
  })
  await verificationCode.save()

  // Send the generated verification code value to the user
  const emailBody = config
    .get('VERIFICATION_CODE_EMAIL_BODY')
    .replace('{verificationCode}', verificationCodeValue)
    .replace('{type}', data.type === VerificationCodeTypes.ForgotPassword ? 'password reset' : 'Sign Up')
    .replace(
      '{title}',
      data.type === VerificationCodeTypes.ForgotPassword ? 'Reset your password?' : 'Thanks for signing up!'
    )
  await sendEmail(config.get('VERIFICATION_CODE_EMAIL_SUBJECT'), emailBody, [data.email])
}

sendVerificationCode.schema = {
  data: Joi.object()
    .keys({
      email: Joi.email(),
      type: Joi.string().required(),
    })
    .required(),
}

async function forgotPassword(data) {
  await checkCode(data.email, data.verificationCode, VerificationCodeTypes.ForgotPassword)

  // We need to check if the user account does not already exist
  const userWithEncryptedEmail = new User({ email: data.email })
  userWithEncryptedEmail.encryptFieldsSync()

  const user = await User.findOne({ email: userWithEncryptedEmail.email })
  if (!user) {
    // The user not exists
    throw new Conflict(`The user with email ${data.email} not exists`)
  }
  user.passwordHash = await hashPassword(data.password)
  await user.save()
}

module.exports = {
  // sendVerificationCode,
  signup,
  login,
  forgotPassword,
}

logger.buildService(module.exports)

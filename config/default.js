'use strict'
/**
* The configuration file.
*/
const { join } = require('path')

const { readFileSync } = require('fs')

const toInteger = require('lodash/toInteger')

const getEmail = (file) => readFileSync(join(__dirname, 'emailTpl', `${file}.html`), 'utf8')

module.exports = {
  // it is configured to be empty currently, but may add prefix like '/api/v1'
  API_PREFIX: process.env.API_PREFIX || '',

  HOST: process.env.HOST || 'http://127.0.0.1:3000',
  FRONT_END_HOST: process.env.FRONT_END_HOST || 'http://127.0.0.1:3001',
  // a string of time span, see https://github.com/zeit/ms
  ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME || '30 days',

  PASSWORD_HASH_SALT_LENGTH: process.env.PASSWORD_HASH_SALT_LENGTH || 10,
  JWT_SECRET: process.env.JWT_SECRET || 's3cret',

  NYLAS_APPLICATION_CLIENT_ID: process.env.NYLAS_APPLICATION_CLIENT_ID || '9zs35vsoryly04om5qph8iro9',
  NYLAS_APPLICATION_CLIENT_SECRET: process.env.NYLAS_APPLICATION_CLIENT_SECRET || 'p99g31llffwzpje9e1samz5g',
  OGNOMY_CALENDAR_NAME: process.env.OGNOMY_CALENDAR_NAME || 'Ognomy-Meetings',

  // The data encryption key
  ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY || 'TIME_SLOT_OUTPUT_TIME_FORMAT',

  MEETING_TITLE_TEMPLATE: process.env.MEETING_TITLE_TEMPLATE || 'Ognomy Appointment: %s and %s',

  MEETING_DESCRIPTION_TEMPLATE: process.env.MEETING_DESCRIPTION_TEMPLATE || 'Ognomy Appointment: %s and %s',
  WORK_DAY_TIME_RANGE: {
    Tuesday: [{ start: '08:30:00', end: '12:00:00' }],
    Wednesday: [{ start: '08:30:00', end: '12:00:00' }],
    Thursday: [{ start: '13:00:00', end: '16:30:00' }]
  },

  TIME_SLOT_LENGTH_MINUTES: process.env.TIME_SLOT_LENGTH_MINUTES || 40,
  TIME_SLOT_OUTPUT_TIME_FORMAT: process.env.TIME_SLOT_OUTPUT_TIME_FORMAT || 'hh:mm a',
  MONTH_DATE_INPUT_FORMAT: process.env.MONTH_DATE_INPUT_FORMAT || 'YYYY-MM',

  // a string of time span, see https://github.com/zeit/ms
  VERIFICATION_CODE_LIFETIME: process.env.VERIFICATION_CODE_LIFETIME || '7 days',

  AVAILABLE_SLOTS_COUNT_NUMBER_OF_DAYS: process.env.AVAILABLE_SLOTS_COUNT_NUMBER_OF_DAYS || 3,

  ZOOM_BASE_URL: process.env.ZOOM_BASE_URL || 'https://api.zoom.us/v2',
  ZOOM_API_KEY: process.env.ZOOM_API_KEY || 'v6M75Or7QkWQdtQiJSMA2w',
  ZOOM_API_SECRET: process.env.ZOOM_API_SECRET || 'INO3rjRqcrg6MyTmn0RFsXjZmySQP9u3WUz8',
  ZOOM_SDK_KEY: process.env.ZOOM_SDK_KEY || 'qzZVLjKlfqIchsSK5xSNpcH5BEXgKbChQnIq',
  ZOOM_SDK_SECRET: process.env.ZOOM_SDK_SECRET || 'KkxRcNPWvXc81uDuzYuMinoWgMY4HONLvZzT',
  ZOOM_ACCESS_TOKEN_LIFETIME: process.env.ZOOM_ACCESS_TOKEN_LIFETIME || '10m',
  ZOOM_ACCOUNT_EMAIL: process.env.ZOOM_ACCOUNT_EMAIL || 'jiangliwu.ipple@gmail.com',
  ZOOM_BUSINESS_LICENSE: process.env.NODE_ENV === 'production',

  FROM_EMAIL: process.env.FROM_EMAIL || 'test@ognomy.com',
  EMAIL: {
    host: process.env.SMTP_HOST || '127.0.0.1',
    port: process.env.SMTP_PORT || 25,
    auth: {
      user: process.env.SMTP_USER || 'user',
      pass: process.env.SMTP_PASSWORD || 'password'
    }
  },

  VERIFICATION_CODE_EMAIL_SUBJECT: process.env.VERIFICATION_CODE_EMAIL_SUBJECT || 'Ognomy Verification Code',
  VERIFICATION_CODE_EMAIL_BODY: process.env.VERIFICATION_CODE_EMAIL_BODY || getEmail('verification-code'),
  APPOINTMENT_CONFIRM_SUBJECT: process.env.APPOINTMENT_CONFIRM_SUBJECT || 'Ognomy First Appointment Confirmation',
  APPOINTMENT_CONFIRM_EMAIL: process.env.APPOINTMENT_CONFIRM_EMAIL || getEmail('first-appointment'),
  APPOINTMENT_FOLLOW_UP_SUBJECT: process.env.APPOINTMENT_CONFIRM_SUBJECT || 'Ognomy Follow Up Appointment Confirmation',
  APPOINTMENT_FOLLOW_UP_EMAIL: process.env.APPOINTMENT_CONFIRM_EMAIL || getEmail('followup-appointment'),
  AWS_KEY: process.env.AWS_KEY || 'AKIAJ6M35MPVPVC6IQBA',
  AWS_SECRET: process.env.AWS_SECRET || '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',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'ognomy-project',

  PATIENT_EMAIL_FILES: process.env.PATIENT_EMAIL_FILES || join(__dirname, '../assets/patient-forms'),
  PATIENT_EMAIL_CONTENT: process.env.PATIENT_EMAIL_CONTENT || getEmail('new-patient'),
  PATIENT_EMAIL_SUBJECT: process.env.PATIENT_EMAIL_SUBJECT || `New Patient Documents`,

  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_BexELIZTH3bB2QG75EPl878G00XcZesofS',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_Udj2NCPjylvY2xatw0790EmB00eCqOWECC',
  STRIPE_MONTY_FORMAT: process.env.STRIPE_MONTY_FORMAT || 'usd',

  // when create/update credit card, system will try to deduct money and refund this if succeed
  CHECK_CARD_PRICE: 100,

  NEW_PROVIDER_SUBJECT: process.env.NEW_PROVIDER_SUBJECT || 'Ognomy Password',
  NEW_PROVIDER_CONTENT: process.env.NEW_PROVIDER_CONTENT || getEmail('doctor-reset-pwd'),

  SUPPORTED_STATE_LIST: process.env.SUPPORTED_STATE_LIST || ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
    'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA',
    'WA', 'WV', 'WI', 'WY', 'DC', 'MH', 'AE', 'AA', 'AE', 'AE', 'AE', 'AP'],
  NYLAS_EVENT_LOCATION: process.env.NYLAS_EVENT_LOCATION || 'Ognomy App',
  TEL_PHONE: '1-877-664-6669',

  // unit is Cents, 50 mean $0.5, 500 mean $5.0
  MEETING_PRICE: 0,

  // the appointment time range (today, today + APPOINTMENT_MAX_DAY)
  APPOINTMENT_MAX_DAY: 90,

  FORCE_UPDATE_PWD: 120,
  SEND_WARNING: [14, 7, 3],

  // days format https://github.com/jkroso/parse-duration#readme
  // rule format https://github.com/node-schedule/node-schedule
  /*
      *    *    *    *    *    *
      ┬    ┬    ┬    ┬    ┬    ┬
      │    │    │    │    │    │
      │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
      │    │    │    │    └───── month (1 - 12)
      │    │    │    └────────── day of month (1 - 31)
      │    │    └─────────────── hour (0 - 23)
      │    └──────────────────── minute (0 - 59)
      └───────────────────────── second (0 - 59, OPTIONAL)
   */
  scheduler: {
    // every minutes
    updateAppointmentRule: '30 * * * * *'
  },

  // https
  SSL: {
    enable: false,
  },

  // Database settings
  DATABASE: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ognomy',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  LOGGING: {
    level: process.env.LOG_LEVEL || 'debug',
  },

  LISTEN: {
    host: process.env.HOST || '127.0.0.1',
    port: toInteger(process.env.PORT || 8080),
  },
}

'use strict'

module.exports = {
  prefix: '/',
  endpoints: {
    health: {
      get: {
        handle: 'Security:ping',
        public: true,
      },
    },
    login: {
      post: {
        handle: 'Security:login',
        public: true,
      },
    },
    forgotPassword: {
      post: {
        handle: 'Security:forgotPassword',
        public: true,
      },
    },
    sendVerificationCode: {
      post: {
        handle: 'Security:sendVerificationCode',
        public: true,
      },
    },
    signup: {
      post: {
        handle: 'Security:signup',
        public: true,
      },
    },
  },
}

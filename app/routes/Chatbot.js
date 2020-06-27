'use strict'

const { UserRoles } = require('../../constants/access')

module.exports = {
  prefix: '/chatbot',
  endpoints: {
    '/questions': {
      get: {
        handle: 'Chatbot:getChatbotQuestions',
        roles: [UserRoles.Patient],
      },
    },
    '/answer': {
      post: {
        handle: 'Chatbot:answer',
        roles: [UserRoles.Patient],
      },
    },
  },
}

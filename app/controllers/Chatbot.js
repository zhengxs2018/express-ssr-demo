const ChatbotService = require('../services/chatbot/Chatbot')

/**
 * get chatbot questions
 * @param req the request
 * @param res the response
 */
async function getChatbotQuestions(req, res) {
  res.json(await ChatbotService.getChatbotQuestions(req.user.id, req.query))
}

/**
 * answer question
 * @param req the request
 * @param res the response
 */
async function answer(req, res) {
  res.json(await ChatbotService.answer(req.user.id, req.files, req.body))
}

module.exports = {
  getChatbotQuestions,
  answer,
}

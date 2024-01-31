const express = require('express');
const router = express.Router();
require('dotenv').config();

const { chatCompletion } = require('../helpers/openaiApi');
const { sendMessage, setTypingOff, setTypingOn } = require('../helpers/messengerApi');
const MAX_MESSAGE_LENGTH = 1900;

router.post('/', async (req, res) => {
  try {
    let body = req.body;
    let senderId = body.senderId;
    let query = 'Be short and concise. No more than 1500 characters. ' + body.query;
    await setTypingOn(senderId);
    let result = await chatCompletion(query);

    let messageToSend = result.response;
    if (messageToSend.length > MAX_MESSAGE_LENGTH) {
      messageToSend = messageToSend.substring(0, MAX_MESSAGE_LENGTH) + '...';
      console.log(`Truncated message to ${messageToSend.length} characters`);
    }

    await sendMessage(senderId, messageToSend);
    await setTypingOff(senderId);
    console.log(senderId);
    console.log(result.response);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send('OK');
});

module.exports = {
  router
};

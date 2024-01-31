const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require("axios").default;

router.get('/', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  console.log(`Received verification request with mode: ${mode}, token: ${token}, challenge: ${challenge}`);

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      console.log('Verification failed. Token mismatch.');
      res.sendStatus(403);
    }
  } else {
    console.log('Verification failed. Mode or token missing.');
    res.sendStatus(400);
  }
});

const callSendMessage = async (url, senderId, query) => {
  let options = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      senderId: senderId,
      query: query
    }
  };
  
  console.log(`Attempting to send message to ${url} with senderId: ${senderId} and query: ${query}`);

  try {
    await axios.request(options);
    console.log('Message sent successfully.');
  } catch (error) {
    console.error('Error in sending message:', error);
  }
};

router.post('/', async (req, res) => {
  console.log('Received message to /facebook POST endpoint.');

  try {
    let body = req.body;
    let senderId = body.entry[0].messaging[0].sender.id;
    let query = body.entry[0].messaging[0].message.text;
    const host = req.hostname;
    let requestUrl = `https://${host}/sendMessage`;

    console.log(`Sender ID: ${senderId}, Query: ${query}, Request URL: ${requestUrl}`);

    await callSendMessage(requestUrl, senderId, query);
  } catch (error) {
    console.error('Error in POST /facebook:', error);
  }

  res.status(200).send('OK');
});

module.exports = {
  router
};

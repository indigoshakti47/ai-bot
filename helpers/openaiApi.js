const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatCompletion = async (prompt) => {

  try {

    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `You rock!` },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo",
    });

    let content = response.choices[0].message.content;
    console.log("content:", content);
  
    return {
      status: 1,
      response: content
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return {
      status: 0,
      response:  `Error: ${error.message || 'Check your key.'}`
    };
  }
};


module.exports = {
  chatCompletion
};
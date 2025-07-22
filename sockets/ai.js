// sockets/ai.js
const { Server } = require('socket.io');
const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
function setupSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('chat message', async (userText) => {
      socket.emit('chat message', { text: userText, isAI: false });

      try {
        const reply = await getAIResponse(userText);
        socket.emit('chat message', { text: reply, isAI: true });

        // Optional stat update
        socket.emit('update stats', {
          hp: 10 + Math.floor(Math.random() * 10),
          str: 12, dex: 14, int: 18, chr: 15,
        });

      } catch (err) {
        console.error('AI Error:', err.message);
        socket.emit('chat message', {
          text: '⚠️ AI failed to respond.',
          isAI: true
        });
      }
    });
  });

  return io;
}

async function getAIResponse(input) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: input }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content.trim();
}

module.exports = setupSocket;

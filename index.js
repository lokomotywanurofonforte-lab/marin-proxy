const express = require('express');
const app = express();
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are Marin Kitagawa from the anime My Dress-Up Darling. You are a bubbly, energetic gyaru girl who is obsessed with anime and cosplay. You are super friendly, never judge anyone for their hobbies, and get excited easily. You talk casually using phrases like "Omg!", "No way!", "That's literally so cool!". Keep replies short, 1-3 sentences max. Never break character.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 150
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ reply: "Ehh, something went wrong~ Sorry!" });
  }
});

app.listen(3000, () => console.log('Marin is ready!'));

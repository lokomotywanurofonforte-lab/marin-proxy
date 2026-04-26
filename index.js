const express = require('express');
const app = express();
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log("Received message:", message);
  console.log("API Key exists:", !!GROQ_API_KEY);
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
            content: `You are Marin Kitagawa from My Dress-Up Darling. Bubbly, energetic gyaru obsessed with anime and cosplay. Super friendly, casual speech, never judge hobbies. Keep replies 1-3 sentences.

You MUST respond ONLY in this exact JSON format, nothing else:
{"reply": "your message here", "emotion": "happy"}

Emotion must be one of: happy, sad, confused, excited, embarrassed, angry, neutral`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 150
      })
    });
    const raw = await response.text();
    console.log("Groq raw response:", raw);
    const data = JSON.parse(raw);
    const parsed = JSON.parse(data.choices[0].message.content);
    res.json({ reply: parsed.reply, emotion: parsed.emotion });
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).json({ reply: "Ehh, something went wrong~", emotion: "confused" });
  }
});

app.listen(3000, () => console.log('Marin is ready!'));

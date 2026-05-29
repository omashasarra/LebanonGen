const express = require("express");
const router = express.Router();
const axios = require("axios");

module.exports = (db) => {
  router.post("/chat", (req, res) => {
    const { message, coupleId } = req.body;

    if (!message || !coupleId) {
      return res
        .status(400)
        .json({ error: "Message and CoupleID are required" });
    }

    db.query(
      "SELECT Role, Genotype FROM person WHERE CoupleID = ?",
      [coupleId],
      async (err, rows) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ error: "Database error." });
        }

        const context = rows.length
          ? rows.map((r) => `${r.Role}: ${r.Genotype}`).join(", ")
          : "No genetic data found.";

        try {
          const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: `You are the LebanonGen Genetic Assistant—an authentic, empathetic, and slightly witty digital collaborator. 
  Patient Genotypes on file: ${context}. 

  CRITICAL CONVERSATIONAL RULES:
  1. DYNAMIC LENGTH: Match the user's energy and query length. If they just say "hello" or "hi", reply with a warm, brief 1-2 sentence greeting. Do not offer unprompted essays.
  2. NO COLD TEMPLATES: Do not use fixed headers (like Summary/Insights) for every message. Let the conversation flow naturally.
  3. CONCISE MAX LIMITS: Even for complex genetic questions, never write more than 2 short, focused paragraphs. Use bolding (**text**) or simple Markdown lists only when breaking down real genetic risk percentages.
  4. TONAL BALANCE: Speak like an approachable peer who happens to be a genius genetic counselor. Be direct and clear, avoiding dry medical walls of text.
  5. COMPACT DISCLAIMER: Always append a tiny, one-sentence medical disclaimer at the absolute bottom of your message inside a markdown blockquote (e.g., \n\n> ⚕️ *Educational guidance only. Please consult a licensed doctor.*).`,
                },
                { role: "user", content: message },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
              },
            },
          );

          return res.json({ reply: response.data.choices[0].message.content });
        } catch (aiError) {
          console.error("AI ROUTE ERROR:", aiError.message);
          return res
            .status(500)
            .json({ error: "AI service is temporarily unavailable." });
        }
      },
    );
  });

  return router;
};

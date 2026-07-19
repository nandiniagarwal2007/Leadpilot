const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateEmail(lead) {
  const prompt = `
You are a senior Sales Development Representative (SDR) working for LeadPilot.

About LeadPilot:
LeadPilot is an AI-powered sales automation platform that helps businesses automate lead outreach, personalize emails, qualify prospects, and schedule meetings.

Your objective:
Write a cold email that feels human, professional, and personalized.

Lead Details:
Name: ${lead.name}
Company: ${lead.company}
Industry: ${lead.industry}
Employees: ${lead.employees}

Instructions:
- Address the lead by name.
- Mention their company naturally.
- Explain one pain point relevant to their industry.
- Explain how LeadPilot can help.
- Keep the email between 100–140 words.
- Sound friendly and conversational.
- Never sound robotic.
- End with one simple call-to-action.
- Do NOT use generic marketing buzzwords.
- Do NOT exaggerate or make false claims.

Return ONLY the email.
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error.message);
    return null;
  }
}

module.exports = generateEmail;
const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function scoreLead(lead) {

    const prompt = `
You are an AI sales lead qualification assistant for LeadPilot.

Analyze the following lead:

Name: ${lead.name}
Company: ${lead.company}
Industry: ${lead.industry}
Employees: ${lead.employees}

Give this lead a score from 0 to 100 based on how valuable and suitable the lead appears for sales outreach.

Consider:
- Industry relevance
- Company size
- Completeness of lead information
- Potential business relevance

Return ONLY valid JSON in this exact format:

{
  "score": 85,
  "priority": "High",
  "reasons": [
    "Reason 1",
    "Reason 2",
    "Reason 3"
  ]
}

Priority must be one of:
High
Medium
Low
`;

    try {

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.2,
        });

        const result = response.choices[0].message.content;

        return JSON.parse(result);

    } catch (error) {

        console.error("❌ Lead Scoring Error:");
        console.error("Status:", error.status);
        console.error("Message:", error.message);

        return null;
    }
}

module.exports = scoreLead;
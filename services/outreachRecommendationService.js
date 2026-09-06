const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function generateOutreachRecommendation(lead) {

    const prompt = `
You are an AI sales strategy assistant for LeadPilot.

Analyze this sales lead:

Name: ${lead.name}
Company: ${lead.company}
Industry: ${lead.industry}
Employees: ${lead.employees}
Lead Score: ${lead.leadScore || "Not scored"}
Priority: ${lead.leadPriority || "Not available"}

Recommend the best next outreach action for this lead.

Consider:
- Industry
- Company size
- Lead score and priority
- Potential relevance for LeadPilot

Return ONLY valid JSON in this exact format:

{
  "recommendedChannel": "Email",
  "recommendedTiming": "Within 24 hours",
  "suggestedAction": "Send a personalized introduction email",
  "reason": "Short explanation"
}

Rules:
- recommendedChannel must be one of: "Email", "Follow-up", "Research First"
- recommendedTiming should be a practical timeframe.
- suggestedAction should be specific and useful.
- reason should be concise.
- Do not make unsupported claims.
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

        const result =
            response.choices[0].message.content;

        return JSON.parse(result);

    } catch (error) {

        console.error("❌ Outreach Recommendation Error:");
        console.error("Status:", error.status);
        console.error("Message:", error.message);

        return null;
    }
}

module.exports = generateOutreachRecommendation;
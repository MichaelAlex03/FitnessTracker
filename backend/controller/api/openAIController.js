const OpenAI = require("openai");
const client = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY
});

const getResponse = async () => {
    const response = await client.responses.create({
        model: "gpt-5-nano",
        input: "Write a one-sentence bedtime story about a unicorn."
    });

    console.log(response.output_text);
    res.status(200).json({ "response": response })
}


module.exports = { getResponse }
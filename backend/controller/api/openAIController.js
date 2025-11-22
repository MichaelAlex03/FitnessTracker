const OpenAI = require("openai");
const client = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY
});

const generateResponse = async (req, res) => {
    const { userText } = req.body

    const response = await client.responses.create({
        model: "gpt-5-nano",
        input: userText
    });

    console.log(response.output_text);
    res.status(200).json({ "response": response })
}


module.exports = { generateResponse }
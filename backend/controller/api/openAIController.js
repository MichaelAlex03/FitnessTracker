const OpenAI = require("openai");
const client = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY
});

const tools = [
    {
        type: "function",
        name: "create_workout_plan",
        description: "Generates a workout plan with exercises based on user's fitness goals, target muscle groups, and preferences. Use this when the user asks to create a workout or wants a workout routine.",
        parameters: {
            type: "object",
            properties: {
                workout_name: {
                    type: "string",
                    description: "A descriptive name for the workout (e.g., 'Chest & Triceps Push Day', 'Full Body Strength')"
                },
                exercises: {
                    type: "array",
                    description: "List of exercises for this workout",
                    items: {
                        type: "object",
                        properties: {
                            exercise_name: {
                                type: "string",
                                description: "Name of the exercise (e.g., 'Bench Press', 'Bicep Curls')"
                            },
                            exercise_category: {
                                type: "string",
                                description: "Equipment type (Barbell, Dumbbell, Machine, Cable, Bodyweight, etc.)"
                            },
                            exercise_bodypart: {
                                type: "string",
                                description: "Primary muscle group (Chest, Back, Shoulders, Arms, Legs, Core, etc.)"
                            }
                        },
                        required: ["exercise_name", "exercise_category", "exercise_bodypart"]
                    }
                },
                reasoning: {
                    type: "string",
                    description: "Brief explanation of why these exercises were chosen and how they meet the user's goals"
                }
            },
            required: ["workout_name", "exercises", "reasoning"]
        }
    }

];

const parseWorkout = (workout) => {
    return JSON.parse(workout);
}

const generateResponse = async (req, res) => {
    const { userText, conversationHistory = [] } = req.body;

    const input = []
    input.push(
        {
            type: "message",
            role: "system",
            content:
                `You are an expert AI fitness coach. You help users with workout advice, form tips, nutrition, and motivation.
  
                    When users ask you to create a workout or want a workout plan, use the create_workout_plan function to generate a structured workout.
                    Be specific with exercise names and ensure exercises match the user's goals and target muscles.
  
                    For general fitness questions, respond naturally with helpful advice.
                        
                    Keep responses concise and motivating.`
        },
        {
            type: "message",
            role: "user",
            content: userText
        })

    try {

        const response = await client.responses.create({
            model: "gpt-5-nano",
            tools: tools,
            tool_choice: "auto",
            input: input
        });


       console.log(response)

       const workout = parseWorkout(response.output[1].arguments);


        // const modelResponse = await client.responses.create({
        //     model: "gpt-5-nano",
        //     tools: tools,
        //     tool_choice: "auto",
        //     input: input,
        //     instructions: "Response with the workout created in JSON with the schema I provided in the create_workout_plan function"
        // })

        // console.log(modelResponse)

        // const workout = JSON.parse(modelResponse.output_text)
        // console.log(workout)
        // console.log(response.choices[0].message.tool_calls[0].function)
        // const responseMessage = response.choices[0].message;

        // // Check if AI wants to call a function
        // if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        //     const toolCall = responseMessage.tool_calls[0];

        //     if (toolCall.function.name === "create_workout_plan") {
        //         const workoutPlan = JSON.parse(toolCall.function.arguments);
        //         console.log(workoutPlan)

        //         // Return structured workout proposal
        //         return res.status(200).json({
        //             type: "workout_proposal",
        //             data: workoutPlan,
        //             message: responseMessage.content || `I've created a workout plan for you: "${workoutPlan.workout_name}". Review the exercises below and let me know if you'd like to save it!`
        //         });
        //     }
        // }

        // Regular text response
        return res.status(200).json({ response: response.output[1].arguments });

    } catch (error) {
        console.error("OpenAI Error:", error);
        return res.status(500).json({
            error: "Failed to generate response",
            details: error.message
        });
    }
};

module.exports = { generateResponse };
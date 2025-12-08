const OpenAI = require("openai");
const pg = require('../../model/sql');


const client = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY
});

const tools = [
    {
        type: "function",
        name: "create_workout_plan",
        description: "Generates a workout plan with exercises based on user's fitness goals, target muscle groups, and preferences. Use this when the user asks to create a workout or wants a workout routine. Dont have more than 6 exercises in a workout",
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
    const userId = req.user.id

    let exerciseList = new Map();

    try {
        const exercises = await pg.getAllExercises(userId);
        for (const exercise in exercises){
            exerciseList.set(exercise, true)
        }
    } catch (error) {
        res.status(500).json({ "message": error.message })
    }

    const input = []
    input.push(
        {
            type: "message",
            role: "system",
            content:
                `You are an expert AI fitness coach. You help users with workout advice, form tips, nutrition, and motivation.
  
                    When users ask you to create a workout or want a workout plan, use the create_workout_plan function to generate a structured workout.
                    Be specific with exercise names and ensure exercises match the user's goals and target muscles.

                    Only generate exercises in ${exerciseList}. DO NOT by any means add a exercise to the workout if it is not listed in ${exerciseList}. 

                    Also try to not generate more than 6 exercises per workout. Most of the time try to aim for 5-6
  
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
        const workoutPlan = parseWorkout(response.output[1].arguments);
        console.log(workoutPlan)

        // If a workoutPlan was generated return it else just return the models normal response
        if (workoutPlan) {
            return res.status(200).json({
                response: workoutPlan,
                id: response.id
            });

        }

        return res.status(200).json({ response: response.output_text, id: response.id });

    } catch (error) {
        console.error("OpenAI Error:", error);
        return res.status(500).json({
            error: "Failed to generate response",
            details: error.message
        });
    }
};

module.exports = { generateResponse };
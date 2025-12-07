# AI Workout Generation Integration Guide

This guide explains how to integrate AI-powered workout creation into your chatbot using OpenAI's function calling feature.

## Overview

The chatbot will be able to generate workout plans when users request them. The flow will be:

1. User asks chatbot to create a workout (e.g., "Create me a chest and triceps workout")
2. OpenAI's API detects the intent and calls a `create_workout_plan` function
3. Backend generates a workout plan with exercises
4. Frontend displays the workout proposal with exercise list
5. User confirms or cancels
6. If confirmed, workout is created using existing APIs

## Architecture

We'll use OpenAI's **Function Calling** feature instead of trying to parse text responses. This gives us structured data and reliable intent detection.

---

## Backend Implementation

### 1. Update OpenAI Controller

**File:** `/backend/controller/api/openAIController.js`

Replace the entire file with:

```javascript
const OpenAI = require("openai");
const client = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY
});

// Define the function that OpenAI can call
const tools = [
    {
        type: "function",
        function: {
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
    }
];

const generateResponse = async (req, res) => {
    const { userText, conversationHistory = [] } = req.body;

    try {
        // Build messages array with conversation history
        const messages = [
            {
                role: "system",
                content: `You are an expert AI fitness coach. You help users with workout advice, form tips, nutrition, and motivation.

When users ask you to create a workout or want a workout plan, use the create_workout_plan function to generate a structured workout. Be specific with exercise names and ensure exercises match the user's goals and target muscles.

For general fitness questions, respond naturally with helpful advice.

Keep responses concise and motivating.`
            },
            ...conversationHistory,
            {
                role: "user",
                content: userText
            }
        ];

        const response = await client.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: messages,
            tools: tools,
            tool_choice: "auto"
        });

        const responseMessage = response.choices[0].message;

        // Check if AI wants to call a function
        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
            const toolCall = responseMessage.tool_calls[0];

            if (toolCall.function.name === "create_workout_plan") {
                const workoutPlan = JSON.parse(toolCall.function.arguments);

                // Return structured workout proposal
                return res.status(200).json({
                    type: "workout_proposal",
                    data: workoutPlan,
                    message: responseMessage.content || `I've created a workout plan for you: "${workoutPlan.workout_name}". Review the exercises below and let me know if you'd like to save it!`
                });
            }
        }

        // Regular text response
        return res.status(200).json({
            type: "text",
            data: {
                text: responseMessage.content
            }
        });

    } catch (error) {
        console.error("OpenAI Error:", error);
        return res.status(500).json({
            error: "Failed to generate response",
            details: error.message
        });
    }
};

module.exports = { generateResponse };
```

### Key Changes:
- Switched from `gpt-5-nano` with Responses API to `gpt-4-turbo-preview` with Chat Completions API
- Added function calling with `create_workout_plan` tool
- System prompt guides AI to use function for workout requests
- Returns different response types: `workout_proposal` or `text`

### 2. Add Conversation History Support

The controller now accepts `conversationHistory` so the AI has context. You'll send this from the frontend.

---

## Frontend Implementation

### 1. Update Message Interface

**File:** `/view/app/(tabs)/Chatbot.tsx`

Update the `Message` interface:

```typescript
interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  type?: 'text' | 'workout_proposal'  // Add this
  workoutData?: {                      // Add this
    workout_name: string
    exercises: Array<{
      exercise_name: string
      exercise_category: string
      exercise_bodypart: string
    }>
    reasoning: string
  }
}
```

### 2. Update handleSendMessage Function

Replace the existing `handleSendMessage` with:

```typescript
const handleSendMessage = async () => {
  if (inputText.trim() === '') return

  const userText = inputText.trim();

  const userMessage: Message = {
    id: Date.now().toString(),
    text: userText,
    isUser: true,
    timestamp: new Date(),
    type: 'text'
  }

  setMessages(prev => [...prev, userMessage])
  setInputText('')
  setIsTyping(true)

  try {
    // Send conversation history for context
    const conversationHistory = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));

    const response = await axiosPrivate.post(`/api/openAI`, {
      userText,
      conversationHistory
    });

    const { type, data, message } = response.data;

    if (type === 'workout_proposal') {
      // AI wants to create a workout
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: message || `I've created "${data.workout_name}" for you!`,
        isUser: false,
        timestamp: new Date(),
        type: 'workout_proposal',
        workoutData: data
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      // Regular text response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiMessage]);
    }

  } catch (err) {
    const error = err as AxiosError<RateLimitError>;
    if (error.response?.status === 429) {
      const { msg, remaining, reset } = error.response.data;
      const resetDate = new Date(reset * 1000);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `⚠️ Rate limit exceeded!\n\nYou have ${remaining} requests remaining.\nResets at ${resetDate.toLocaleTimeString()}\n\nUpgrade to Pro for unlimited requests!`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      Alert.alert("Error generating response", "There was an error generating a response please try again", [{
        text: "Ok",
        onPress: () => setMessages([])
      }]);
    }
  } finally {
    setIsTyping(false)
  }
}
```

### 3. Add Workout Creation Handler

Add this new function to handle workout creation:

```typescript
const handleCreateWorkoutFromAI = async (workoutData: Message['workoutData']) => {
  if (!workoutData) return;

  try {
    // Step 1: Create the workout
    const workoutResponse = await axiosPrivate.post('/api/workouts', {
      userId: auth.userId,
      workoutName: workoutData.workout_name
    });

    const workoutId = workoutResponse.data.workoutId;

    // Step 2: Add exercises to the workout
    const exercisesPayload = workoutData.exercises.map(ex => ({
      exercise_name: ex.exercise_name,
      // Note: workout_template_id is not needed when creating from AI
    }));

    await axiosPrivate.post('/api/exercises', {
      workoutId,
      selectedExercises: exercisesPayload
    });

    // Success message
    Alert.alert(
      "Workout Created!",
      `"${workoutData.workout_name}" has been added to your workouts.`,
      [{ text: "OK" }]
    );

    // Add confirmation message to chat
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `✅ Workout "${workoutData.workout_name}" has been created and saved!`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, confirmationMessage]);

  } catch (error) {
    console.error("Error creating workout:", error);
    Alert.alert(
      "Error",
      "Failed to create workout. Please try again.",
      [{ text: "OK" }]
    );
  }
};
```

### 4. Add Workout Proposal UI Component

Add this render function before the existing `renderMessage` function:

```typescript
const renderWorkoutProposal = (message: Message) => {
  const { workoutData } = message;
  if (!workoutData) return null;

  return (
    <View className='mb-4 px-4'>
      <View className='bg-surface border-2 border-accent/50 rounded-2xl rounded-bl-none p-4 max-w-[90%]'>

        {/* Header */}
        <View className='flex-row items-center mb-3'>
          <View className='bg-accent/20 rounded-full p-2 mr-3'>
            <MaterialCommunityIcons name="dumbbell" size={20} color="#6366F1" />
          </View>
          <View className='flex-1'>
            <Text className='text-white font-pbold text-lg'>
              {workoutData.workout_name}
            </Text>
          </View>
        </View>

        {/* Reasoning */}
        <Text className='text-gray-300 font-pmedium text-sm mb-4 leading-5'>
          {workoutData.reasoning}
        </Text>

        {/* Exercises List */}
        <View className='bg-primary rounded-xl p-3 mb-4'>
          <Text className='text-gray-400 font-pmedium text-xs mb-2 uppercase'>
            Exercises ({workoutData.exercises.length})
          </Text>
          {workoutData.exercises.map((exercise, index) => (
            <View
              key={index}
              className='flex-row items-center py-2 border-b border-gray-700'
              style={{ borderBottomWidth: index === workoutData.exercises.length - 1 ? 0 : 1 }}
            >
              <View className='bg-accent/20 rounded-full w-6 h-6 items-center justify-center mr-3'>
                <Text className='text-accent font-pbold text-xs'>{index + 1}</Text>
              </View>
              <View className='flex-1'>
                <Text className='text-white font-pmedium text-sm'>
                  {exercise.exercise_name}
                </Text>
                <Text className='text-gray-500 font-pregular text-xs'>
                  {exercise.exercise_bodypart} • {exercise.exercise_category}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className='flex-row gap-2'>
          <TouchableOpacity
            className='flex-1 bg-accent rounded-xl py-3 active:scale-95'
            onPress={() => handleCreateWorkoutFromAI(workoutData)}
          >
            <Text className='text-white font-pbold text-center text-sm'>
              Create Workout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 bg-gray-700 rounded-xl py-3 active:scale-95'
            onPress={() => {
              const cancelMsg: Message = {
                id: Date.now().toString(),
                text: "No problem! Let me know if you'd like a different workout.",
                isUser: false,
                timestamp: new Date(),
                type: 'text'
              };
              setMessages(prev => [...prev, cancelMsg]);
            }}
          >
            <Text className='text-white font-pmedium text-center text-sm'>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timestamp */}
        <Text className='text-gray-500 font-pregular text-xs mt-3'>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};
```

### 5. Update renderMessage Function

Modify the existing `renderMessage` to handle workout proposals:

```typescript
const renderMessage = ({ item }: { item: Message }) => {
  // If it's a workout proposal, use special rendering
  if (item.type === 'workout_proposal') {
    return renderWorkoutProposal(item);
  }

  // Regular message rendering
  return (
    <View className={`mb-4 px-4 ${item.isUser ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-[80%] rounded-2xl p-4 ${item.isUser
        ? 'bg-accent rounded-br-none'
        : 'bg-surface border-2 border-gray-700 rounded-bl-none'
        }`}>
        <Text className={`${item.isUser ? 'text-white' : 'text-gray-200'} font-pmedium text-base leading-6`}>
          {item.text}
        </Text>
        <Text className={`${item.isUser ? 'text-white/70' : 'text-gray-500'} font-pregular text-xs mt-2`}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};
```

### 6. Import useAuth Hook

At the top of the file, import the auth hook:

```typescript
import useAuth from '@/hooks/useAuth'
```

And add it to the component:

```typescript
const Chatbot = () => {
  const { auth } = useAuth();  // Add this line
  // ... rest of your state
```

---

## Additional Considerations

### 1. Rate Limiting for Pro Users

Since AI workout generation is a Pro feature, you may want to check `auth.isPaid` before allowing this:

```typescript
// In handleCreateWorkoutFromAI, add this check at the beginning:
if (!auth.isPaid) {
  Alert.alert(
    "Pro Feature",
    "AI Workout Generation is a Pro feature. Upgrade to create workouts with AI!",
    [
      { text: "Cancel" },
      { text: "Upgrade", onPress: () => setShowProModal(true) }
    ]
  );
  return;
}
```

### 2. Workout Limit for Free Users

Your existing code checks if free users have hit the 6 workout limit. You can apply the same logic here.

### 3. Exercise Database Matching

The AI will generate exercise names that might not exactly match your database. You have two options:

**Option A:** Let AI create custom exercises (user-created exercises)
- Exercises from AI are automatically user-created
- They get saved to the exercises table with `user_id`

**Option B:** Match AI exercises to your database
- Query your database for similar exercise names
- Present a matching/selection UI
- More complex but ensures consistency

For MVP, Option A is simpler.

### 4. Error Handling

Add proper error handling for:
- OpenAI API failures
- Invalid function call arguments
- Database errors during workout creation

---

## Testing

### Test Cases

1. **Basic workout request:**
   - User: "Create me a chest workout"
   - Expected: AI generates 6-8 chest exercises

2. **Specific request:**
   - User: "I want a leg day with squats and lunges"
   - Expected: AI includes those exercises

3. **Multiple muscle groups:**
   - User: "Create a push pull legs split"
   - Expected: AI might ask which day, or create one

4. **Conversation context:**
   - User: "What muscles does bench press work?"
   - AI: Explains
   - User: "Create me a workout with that"
   - Expected: AI creates chest workout based on context

5. **Rejection flow:**
   - User requests workout
   - User clicks "Cancel"
   - Expected: Polite message, conversation continues

6. **Confirmation flow:**
   - User requests workout
   - User clicks "Create Workout"
   - Expected: Workout saved, success message

---

## Example User Flows

### Flow 1: Simple Workout Creation
```
User: "Create me a back and biceps workout"

AI: [Generates workout proposal]
    Workout Name: "Back & Biceps Power Day"
    Exercises:
    1. Pull-ups (Bodyweight, Back)
    2. Barbell Rows (Barbell, Back)
    3. Lat Pulldowns (Cable, Back)
    4. Face Pulls (Cable, Back)
    5. Barbell Curls (Barbell, Arms)
    6. Hammer Curls (Dumbbell, Arms)

    Reasoning: "This workout targets your back with compound movements
    like pull-ups and rows, then isolates biceps with curls..."

[User sees "Create Workout" and "Cancel" buttons]

User: [Clicks "Create Workout"]

AI: "✅ Workout 'Back & Biceps Power Day' has been created and saved!"
```

### Flow 2: Conversational Creation
```
User: "What's a good workout for beginners?"

AI: "For beginners, I recommend focusing on compound movements that
work multiple muscle groups. A full-body routine 3x per week is ideal..."

User: "Can you create that workout for me?"

AI: [Generates "Beginner Full Body Workout" with 5-6 exercises]

User: [Clicks "Create Workout"]

AI: "✅ Workout saved!"
```

---

## Notes

- The OpenAI model `gpt-4-turbo-preview` is powerful but costs more than simpler models. Consider `gpt-3.5-turbo` for cost savings.
- Function calling is very reliable for structured data extraction.
- You can extend this pattern to other features like "create meal plan", "log workout", etc.
- The system prompt can be tuned to generate better exercise selections.

---

## Troubleshooting

**Issue:** AI doesn't call the function
- Make sure your user prompt clearly indicates they want to create a workout
- Check the function description in the tools array
- Verify the model supports function calling (gpt-3.5-turbo and above)

**Issue:** Exercises don't match database
- Implement exercise name normalization
- Add exercise category validation
- Consider adding a mapping layer

**Issue:** Rate limit errors
- OpenAI has its own rate limits
- Handle these gracefully with retry logic
- Show user-friendly messages

---

Good luck with implementation! Let me know if you need any clarifications.
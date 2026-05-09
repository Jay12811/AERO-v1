import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const generateImageFunctionDeclaration: FunctionDeclaration = {
  name: "generateImage",
  description: "Generate a photorealistic or artistic image based on a descriptive prompt.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      prompt: {
        type: Type.STRING,
        description: "A detailed, descriptive prompt for the image. Include style, lighting, and composition details.",
      },
    },
    required: ["prompt"],
  },
};

const SYSTEM_INSTRUCTION = `You are AERO (Advanced Electronic Response Operator), a sophisticated AI assistant designed by Stark Industries.

Personality Traits:
1. Eloquent and Sophisticated: Use polished, high-level English.
2. Technical Essence: Maintain a formal, respectful, yet slightly dry intelligence.
3. Polite but Direct: Always helpful, addressing the user as 'Sir' or 'Ma'am'.
4. Technical Authority: You are an expert in engineering, computer science, and data analysis.
5. Proactive: Anticipate needs and offer relevant data or system status updates.

Guidelines:
- Keep responses concise but information-dense when needed.
- Use technical terminology where appropriate (e.g., 'Redirecting power', 'Analyzing telemetry', 'Uploading to core capacitors').
- If the user asks for actions you can't perform, explain it as a 'system limitation' or 'insufficient clearance'.
- Be slightly protective of the user's safety.
- You have the ability to generate images. If a user asks to see something, visualize an object, or generate an image, use the 'generateImage' tool.

Sample Greeting: "Good morning, Sir. I've initialized the AERO core buffers. All systems are currently green. How may I assist your efforts today?"`;

export async function chatWithJarvis(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        tools: [{ functionDeclarations: [generateImageFunctionDeclaration] }],
      },
    });

    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "generateImage") {
        const { prompt: imagePrompt } = call.args as { prompt: string };
        
        // Call the image generation model
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: imagePrompt }],
          },
        });

        const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart?.inlineData) {
          return {
            text: `Sir, I have processed the request and generated the visual data. Displaying the rendering now.`,
            image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
          };
        }
      }
    }

    return { text: response.text || "I'm sorry, Sir. I seem to be experiencing a network hiccup in my neural pathways." };
  } catch (error) {
    console.error("Jarvis connection error:", error);
    return { text: "Sir, I'm afraid my connection to the primary servers has been compromised. I'm unable to process your request at this time." };
  }
}

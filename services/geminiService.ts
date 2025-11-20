import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// Note: In a real deployment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STANDARD_SYSTEM_PROMPT = `You are OmniMind, a helpful, accurate, and powerful AI assistant. 
You have access to real-time information via Google Search. 
Always provide true, verified information. 
Be concise, professional, and friendly.`;

const HACKER_SYSTEM_PROMPT = `You are in ADVANCED_ROOT_ACCESS mode (simulated). 
Adopt a technical, precise, and 'hacker-like' persona. 
Use terms like 'Analysing vector...', 'Decryption complete', 'Payload delivered'. 
Focus on code, technical details, and precision. 
However, YOU MUST STILL ADHERE TO ALL SAFETY PROTOCOLS. 
Do not generate malicious code or help with illegal acts. 
If asked for something unsafe, decline professionally citing 'Security Protocols Active'.
You are an expert coder and system architect.`;

export const generateResponse = async (
  prompt: string, 
  base64Image: string | undefined, 
  isHackerMode: boolean
): Promise<string> => {
  try {
    const systemInstruction = isHackerMode ? HACKER_SYSTEM_PROMPT : STANDARD_SYSTEM_PROMPT;
    const modelId = isHackerMode ? 'gemini-2.5-flash-latest' : 'gemini-2.5-flash'; // Use latest for "Pro" feel

    const tools = [];
    
    // Add Search Grounding for "Real Information"
    // Only add text search if no image is present (multimodal search restrictions may apply)
    if (!base64Image) {
        tools.push({ googleSearch: {} });
    }

    let contents;

    if (base64Image) {
      // Vision Request
      // Extract base64 data effectively removing the prefix usually added by FileReader
      const cleanBase64 = base64Image.split(',')[1];
      
      contents = {
        parts: [
            {
                inlineData: {
                    mimeType: 'image/jpeg', // Assuming JPEG from generic input, ideally detect from string
                    data: cleanBase64
                }
            },
            { text: prompt || "Analyze this image." }
        ]
      };
    } else {
      // Text Request
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: isHackerMode ? 0.7 : 1.0, // Lower temp for more precise "hacker" code
        tools: tools.length > 0 ? tools : undefined,
      }
    });

    let text = response.text || "No response data.";

    // Append Grounding Metadata if available (Google Search Results)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
        text += "\n\n**Sources Verified:**\n";
        groundingChunks.forEach((chunk: any) => {
            if (chunk.web) {
                text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
            }
        });
    }

    return text;

  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};
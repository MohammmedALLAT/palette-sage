
import { GoogleGenAI, Type } from '@google/genai';
import type { Color } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export const generatePalette = async (theme: string): Promise<Color[]> => {
  const prompt = `Create a color palette with 5-6 colors for the theme: "${theme}". For each color, provide a name and a short description of its mood or use case. The hex code must be a valid 6-digit hex string starting with #.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hex: {
                type: Type.STRING,
                description: 'The hex color code, e.g., #RRGGBB',
              },
              name: {
                type: Type.STRING,
                description: 'A creative name for the color.',
              },
              description: {
                type: Type.STRING,
                description: 'A short description of the color\'s mood or application.',
              },
            },
            required: ["hex", "name", "description"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the API.");
    }
    
    const palette: Color[] = JSON.parse(jsonText);

    // Validate the response
    if (!Array.isArray(palette) || palette.some(c => !c.hex || !c.name || !c.description)) {
        throw new Error("API returned data in an unexpected format.");
    }

    return palette;

  } catch (error) {
    console.error("Error generating palette:", error);
    throw new Error("Failed to generate color palette. The model may be unable to process this request. Please try a different theme.");
  }
};

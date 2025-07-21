import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

const gemini = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

export const transcribeAudio = async (
    audioAsBase64: string,
    mimeType: string
) => {
    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: "Transcribe the audio into Portuguese. Be accurate and natural in your transcription. Maintain proper punctuation and divide the text into paragraphs where appropriate.",
            },
            {
                inlineData: {
                    mimeType,
                    data: audioAsBase64,
                },
            },
        ],
    });

    if (!response.text) {
        throw new Error("Unable to convert audio");
    }

    return response.text;
};

export const generateEmbeddings = async (text: string) => {
    const response = await gemini.models.embedContent({
        model: "text-embedding-004",
        contents: [{ text }],
        config: {
            taskType: "RETRIEVAL_DOCUMENT",
        },
    });

    if (!response.embeddings?.[0].values) {
        throw new Error("Unable to generate embeddings.");
    }

    return response.embeddings[0].values;
};

export const generateAnswer = async (
    question: string,
    transcriptions: string[]
) => {
    const context = transcriptions.join("\n\n");

    const prompt = `
    Based on the text provided below as context, answer the question clearly and accurately in English.
  
    CONTEXT:
    ${context}

    QUESTION:
    ${question}

    Instructions:
    - Use only information contained in the context sent; 
    - If the answer is not found in the context, just answer that you do not have enough information to answer; 
    - Be objective; 
    - Keep an educational and professional tone; 
    - Name relevant excerpts from the context if appropriate; 
    - If you are quoting the context, use the fear "content of the class";
  `.trim();

    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: prompt,
            },
        ],
    });

    if (!response.text) {
        throw new Error("Error generating Gemini response");
    }

    return response.text;
};

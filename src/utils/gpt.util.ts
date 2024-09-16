import axios from "axios";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const geminiAPI = async (employeeName:string,metrics: {
  productivity: number;
  teamwork: number;
  punctuality: number;
  communication: number;
  problemSolving: number;
}): Promise<string> => {
  try {
    // Create the prompt with detailed instructions for feedback generation
    const prompt = `Provide feedback for an ${employeeName} based on the following performance metrics:
    - Productivity: ${metrics.productivity}/10
    - Teamwork: ${metrics.teamwork}/10
    - Punctuality: ${metrics.punctuality}/10
    - Communication: ${metrics.communication}/10
    - Problem-solving: ${metrics.problemSolving}/10
    Feedback should be professional, constructive, and vary based on the performance scores (1-10 scale):
    - High scores (7-10): Positive feedback.
    - Mid-range scores (4-6): Suggestions for improvement.
    - Low scores (1-3): Constructive criticism with recommendations for improvement.`;

    // Define the payload for the Gemini API
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    // Make the request to the Google Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if 'candidates' exists and extract the generated content properly
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0
    ) {
      const generatedFeedback =
        response.data.candidates[0].content.parts[0].text;
      return generatedFeedback;
    } else {
      return "No feedback generated";
    }
  } catch (err: any) {
    throw new Error(`Gemini API call failed: ${err.message}`);
  }
};

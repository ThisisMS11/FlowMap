import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from '../middleware/asyncHandler.js';

export const GenerateResults = asyncHandler(async (req, res, next) => {
    const { text } = req.body;

    /* Validate if the text is provided */
    if (!text) {
        return res.status(400).send({
            success: false,
            message: 'No text provided'
        });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {

        const prompt = `
        Analyze the following technical process description and extract:  
            1. Main steps in chronological order  
            2. Sub-steps or related processes for each main step  
            3. Technical terms and their relationships  
            4. Any verified and accurate lucid icons names (you can use web to verify) that would represent each step.  

        Text: """  
        ${text}
        """  

        Return only the JSON object in the following format. Do not include any additional text, comments, or code block markers:
        {
            "steps": [
                {
                    "title": "step title",
                    "icon": "accurate CloudIcon name or equivalent visual element",
                    "subSteps": ["related sub-step"],
                    "position": "above/below timeline",
                    "technicalTerms": ["associated terms"]
                }
            ]
        }
    `;


        const result = await model.generateContent(prompt);

        
        const response = result.response.text();
        const cleanedResponse = response.replace(/```json|```/g, "").trim();
        const parsedJson = JSON.parse(cleanedResponse);


        /* Check if the response contains valid data */
        if (!parsedJson || !parsedJson.steps) {
            return res.status(500).send({
                success: false, 
                message: 'Error analyzing the text'
            });
        }

        /* Return the formatted response as a JSON object */
        res.status(200).send({
            success: true,
            data: parsedJson
        });

    } catch (error) {
        /* Handle any errors that occur during the process */
        next(new Error(`Error processing the request: ${error.message}`));
    }
});

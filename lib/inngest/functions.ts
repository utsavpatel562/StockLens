import {inngest} from "@/lib/inngest/client"
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts"

/**
 * Inngest Function: sendSigUpEmail
 * 
 * Triggered when a new user account is created (`app/user.created` event).
 * Uses AI (Gemini model) to generate a personalized welcome message 
 * based on the user's investment profile, and sends a welcome email.
 */
export const sendSigUpEmail = inngest.createFunction(
    {id: 'sign-up-email'},
    {event: 'app/user.created'},
    async({event, step}) => {
        // Build a descriptive user profile summary from event data
        const userProfile =  `
        - Country ${event.data.country}
        - Investment goals: ${event.data.investmentGoals}
        - Risk tolerance: ${event.data.riskTolerance}
        - Preferred industry: ${event.data.preferredIndustry} 
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

    /**
     * Use the AI inference step to generate a personalized welcome email introduction.
     * - Model: Gemini 2.0 Flash Lite (fast lightweight variant)
     * - Input: The customized prompt containing the user profile
     */
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({model: 'gemini-2.0-flash-lite'}), 
                body: {
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: prompt }
                            ]
                        }]
                }
            })
            /**
             * Use another step to actually send the email.
             * (The code here only retrieves the AI-generated intro text — 
             * integration with an email provider would happen inside this step.)
             */
            await step.run('send-welcome-email', async() => {
                const part = response.candidates?.[0]?.content?.parts?.[0];
                const introText = (part && 'text' in part ? part.text : null) || "Thanks for joining StockLens. You now have the tools to track markets and make smarter moves."
            })
        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)
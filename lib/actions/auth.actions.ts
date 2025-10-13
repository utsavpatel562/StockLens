'use server';

import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

/**
 * Server Action: signUpWithEmail
 *
 * Handles user sign-up via email and password using Better Auth.
 * After successful registration, triggers an Inngest event to start
 * post-sign-up workflows (like sending a welcome email or creating a user profile).
 *
*/
export const signUpWithEmail = async({email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry}: SignUpFormData) => {
    try {
        /**
        * Step 1: Register the user with Better Auth.
        * - Sends the user's credentials to the authentication API.
        * - Automatically handles validation and hashing under the hood.
        */
        const response = await auth.api.signUpEmail({
            body: {email, password, name: fullName}
        })
        /**
         * Step 2: If sign-up succeeded, trigger an Inngest event.
         * - This can start background processes like:
         * - Sending a personalized welcome email
         * - Setting up default user data or preferences
         * - Logging analytics or onboarding steps
         */
        if(response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry,
                }
            })
        }
        // Step 3: Return success response with the user data
        return {success:true, data: response}
    } catch(e) {
        // Log and handle any error that occurs during sign-up or event sending
        console.log("Sign up failed", e)
        return {sucess: false, error: 'Sign up failed'}
    }
}
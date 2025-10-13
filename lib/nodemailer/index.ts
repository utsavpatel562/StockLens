import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

/**
 * Create a reusable Nodemailer transporter for sending emails.
 * 
 * - Uses Gmail as the email service.
 * - Authenticated via credentials stored in environment variables.
 * 
 * NOTE: For production, consider using an OAuth2 token or a dedicated email
 * provider (like SendGrid, Mailgun, or AWS SES) for improved reliability and security.
 */
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async({email, name, intro}: WelcomeEmailData) => {
    // Inject user-specific data (name and intro) into the HTML email template
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro);
    // Configure email properties: sender, recipient, subject, and content
    const mailOptions = {
        from: `"StockLens" <stocklens@market.pro>`,
        to: email,
        subject: `Welcome to StockLens - your stock market toolkit is ready!`,
        text: 'Thanks for joining StockLens',
        html: htmlTemplate,
    }
    // Send the email using the configured transporter
    await transporter.sendMail(mailOptions);
}
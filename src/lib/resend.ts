import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string,
) {
  const verificationUrl = `${process.env.AUTH_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email address",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Niche, ${name}!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Email
        </a>
        <p style="margin-top: 16px; color: #666;">
          This link will expire in <strong>24 hours</strong>.
        </p>
        <p style="color: #666;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
        `,
  });
}

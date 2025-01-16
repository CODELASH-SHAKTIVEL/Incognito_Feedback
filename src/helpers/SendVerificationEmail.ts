import { resend } from "@/lib/Resend.email";
import VerificationEmail from "../../Emails/EmailVerificationtemplate";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
  ): Promise<ApiResponse> {
    try {
      await resend.emails.send({
        from: 'shaktielangovan93@gmail.com',
        to: email,
        subject: 'Mystery Message Verification Code',
        react: VerificationEmail({ username, otp: verifyCode }),
      });
      return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return { success: false, message: 'Failed to send verification email.' };
    }
  }

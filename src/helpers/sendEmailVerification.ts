import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Mstry Message <onboarding@resend.dev>",
      to: email,
      subject: "Mstry Message || Verification Email",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: "Verification Email has been send Successfully!",
    };
  } catch (emailError) {
    console.log("Error while sending the Verification Email: ", emailError);

    return {
      success: false,
      message: "Error while sending the verification Email!",
    };
  }
}

import { sendVerificationEmail } from "@/helpers/sendEmailVerification";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // finding the user on the bases of username and isVerified = True

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        { status: 400 }
      );
    }

    // find the user on the bases of email

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User with this email is already exists!",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // creating a new or fresh user and save it to our database ===>>>>

      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
    }

    // sending the verification Email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: `Verification Email Has been sent successfully on ${email}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while registring the user: ", error);

    return Response.json(
      {
        success: false,
        message: "Error while regstring the user",
      },
      {
        status: 500,
        statusText: "Internal Server Error!: 500",
      }
    );
  }
}

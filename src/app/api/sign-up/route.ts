import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { sendVerificationEmail } from "@/helpers/SendVerificationEmail";
import bcrypt from 'bcryptjs' ;

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { Username, email, password } = await request.json();
    const existingVerifiedUserByUsername = await UserModel.findOne({
      Username,
      isVerified: true,
    });
    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
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
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        Username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        Messages: [],
      });

      await newUser.save();
    }
    // send the verification email to the user
    const verifyEmail = await sendVerificationEmail(
      email,
      Username,
      verifyCode
    );
    if (!verifyEmail.success) {
      return Response.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}

import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username , code} = await request.json();

        const decodedUser = decodeURIComponent(username);

        const user = await UserModel.findOne({username: decodedUser})

        if(!user){
            return Response.json({
                success: false,
                message: "User not found!"
            }, {status: 404})
        }

        const isCodeValid = user.verifyCode === code;

        const isCodeNotExpiry = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpiry){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User account verified successfully!"
            }, {status: 200})
        } else if (!isCodeNotExpiry){
             return Response.json({
                success: false,
                message: "Code is expired! SignIn again to get the new code!"
            }, {status: 400})
        } else {
            if(!isCodeValid){
                 return Response.json({
                success: false,
                message: "Incorrect Verification Code!"
            }, {status: 400})
            }
        }

    } catch (error) {
         console.log('Error while verify user!' , error)
        return Response.json(
            {
                success: false,
                message: "Error while verify user!"
            },
            {
                status: 500,
                statusText: "Internal server error !"
            }
        )
    }
}
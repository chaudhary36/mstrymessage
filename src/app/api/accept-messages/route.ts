import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions)

        const user: User = session?.user as User;

        if(!session || !session.user){
             return Response.json({
            success: false ,
            message: 'Not authenticated!'
        }, {status: 402})
        }

    const userId = user._id;

    const {acceptMessages} = await request.json();

    
    try {
       const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessage: acceptMessages},
        {new: true}
       ) 

       if(!updatedUser){
         return Response.json({
            success: false ,
            message: 'Failed to fetch the user to update the accept messages status'
        }, {status: 400})
       }

       return Response.json({
            success: true ,
            message: 'User accepting messages status updated successfully!',
            updatedUser
        }, {status: 201})

    } catch (error) {
        console.log('Error while update user status to change isAcceptingMessages!' , error)
         return Response.json({
            success: false ,
            message: 'Error while update user status to change isAcceptingMessages!'
        }, {status: 500})
    }

    } catch (error) {
         console.log('Error Accept Messages!' , error)
        return Response.json(
            {
                success: false,
                message: "Error Accept Messages!"
            },
            {
                status: 500,
                statusText: "Internal server error !"
            }
        )
    }
}


export async function GET(request: Request) {
    await dbConnect();

     try {
        const session = await getServerSession(authOptions)
   
           const user: User = session?.user as User;
   
           if(!session || !session.user){
                return Response.json({
               success: false ,
               message: 'Not authenticated!'
           }, {status: 402})
           }
   
       const userId = user._id;
   
       const foundUser = await UserModel.findById({userId});
   
       if(!foundUser){
            return Response.json({
               success: false ,
               message: 'User not found !'
           }, {status: 404})
       }
   
        return Response.json({
               success: true ,
               isAcceptingMessage: foundUser.isAcceptingMessage
           }, {status: 200})
     } catch (error) {
         console.log('Error while getting current messages status' , error)
        return Response.json(
            {
                success: false,
                message: "Error while getting current messages status"
            },
            {
                status: 500,
                statusText: "Internal server error !"
            }
        )
     }
}
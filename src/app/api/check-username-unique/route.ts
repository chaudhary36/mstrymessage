import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// we have to write a schema query before writing any code; The syntex is unique and hard coded so don't worry about learning these --

const usernameValidationSchemaQuery = z.object({
    username: usernameValidation
});

export async function GET(request: Request){

    await dbConnect();

    try {
        const {searchParams} =  new URL(request.url)
        
        const usernameParams = {
            username: searchParams.get('username')
        }

        // validate with zod --

        const result = usernameValidationSchemaQuery.safeParse(usernameParams)

        // please console.log(result) to know more ...

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json(
                {
                success: false ,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid username parameters!"
            },
            {
            status: 400
        }
    )
    }

    // console.log 

    const {username} = result.data

    const exisitingVerifiedUser = await UserModel.findOne({username, isVerified: true});

    if(exisitingVerifiedUser){
        return Response.json({
            success: false ,
            message: 'Username is already taken! Try another'
        }, {status: 400})
    }

     return Response.json({
            success: false ,
            message: 'Username is unique@'
        }, {status: 200})

    } catch (error) {
        console.log('Error while checking the username uniquness!' , error)
        return Response.json(
            {
                success: false,
                message: "Error while checking the username uniquness!"
            },
            {
                status: 500,
                statusText: "Internal server error !"
            }
        )
    }
}
import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
};

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Database is already connected!")
        return
    };

    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI || '' , {})

        // Console.log to dbConnection

        connection.isConnected = dbConnection.connections[0].readyState;

        console.log('Database is connected successfully!')

    } catch (error) {
        console.log("Something went wrong while connecting the database!" , error)
        process.exit(1)
    }
}
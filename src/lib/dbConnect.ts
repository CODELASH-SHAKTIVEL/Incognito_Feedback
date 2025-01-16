import mongoose from "mongoose";

type connectionObject = {
    isconnected?: number
}

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isconnected) {
        console.log("Database connection is established already")
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URL || "", {})
        connection.isconnected = db.connections[0].readyState;
        console.log("Database connected successfully ", db.connection)
    } catch (error) {
        console.log("Database connection error", error)
        process.exit(1);
    }
}

export default dbConnect;

// what is the use of connection.isconnected becoz nextjs is edge time framework request or reponse on the server side not runs all time everytime request comes the database connection is established
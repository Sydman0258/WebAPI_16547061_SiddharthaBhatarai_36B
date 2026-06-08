import { connectToMongoose } from './src/database/mongodb';
import app from"./src/app";
import { PORT } from './src/config/constant';


connectToMongoose()
    .then(() => {
        console.log("MongoDB Successfully Connected");
    }).catch((error) => {
        console.log("Failed To Connect to MongdDb");
        process.exit(1);
    });

app.listen(
    PORT,
    ()=>{
        console.log(`Server Running at : ${PORT}`)
    }
);

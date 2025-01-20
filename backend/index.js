require("dotenv").config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;

const connectDB = require("./db/connect");
const apiRoutes = require("./routes/index");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/tasks", apiRoutes.tasks);

app.listen(PORT, async (req, res) => {
    console.log("Server is listening at port - ", PORT)
    try{
        await connectDB(process.env.MONGODB_URI);
        console.log("Mongodb connected successfully!");
    }catch(err){
        console.error(err);
    }
});

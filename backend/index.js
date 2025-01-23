require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const YAML = require("yamljs");
const PORT = process.env.PORT;
const app = express();

const swaggerDocument = YAML.load("./swagger.yaml"); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const connectDB = require("./db/connect");
const apiRoutes = require("./routes/index");


app.use(express.json());
app.use(cors());

app.use("/api/users", apiRoutes.users);
app.use("/api/tasks", apiRoutes.tasks);

// app.get("/",(req, res) => {
//     res.send("Hello World");
// });

app.listen(PORT, async (req, res) => {
    console.log("Server is listening at port - ", PORT)
    try {
        await connectDB(process.env.MONGODB_URI);
        console.log("Mongodb connected successfully!");
    } catch (err) {
        console.error(err);
    }
});

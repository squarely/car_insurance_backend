import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectToMongoDB from "./Configs/mongodb.connections.js";
import globalAuthentication from "./Middleware/jwt.middleware.js";
import errorHandler from "./Errors/errorHandler.js";

import userRoutes from "./Routes/user.routes.js";
import cliamRoutes from "./Routes/claim.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(globalAuthentication());

const APIv1 = process.env.APIV1;

// Routes
app.use(`${APIv1}/user`, userRoutes);
app.use(`${APIv1}/claim`, cliamRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectToMongoDB();
});




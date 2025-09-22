import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/indexRoute.js";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://sih-tr2t.vercel.app"
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", indexRoute);

export default app;

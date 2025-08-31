import express from "express";
import cors from "cors";

const app = express();


app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);


app.get("/", (req, res) => {
    res.send("Server is running with CORS enabled!");
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on PORT: ${PORT}`);
});
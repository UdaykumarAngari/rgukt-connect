import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {
    res.send("API is working fine!");
});

app.get("/api/v1/test", (req, res) => {
    res.json({
        status: "success",
        message: "RGUKT Connect is online 🎓"
    });
});

export default app;
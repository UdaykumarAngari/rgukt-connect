import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes.js';

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

app.use("/api/v1/users", userRouter);
app.use(userRouter); // also exposes POST /register (same handler)

export default app;
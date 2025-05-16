import express from "express";
import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/auth.middleware";
import userRouter from "./routes/user.route";
import roleRequestRouter from "./routes/role-request.route";
import articleRouter from "./routes/article.route";

const app = express();
const API_PREFIX = "/api";

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is home route");
});

// Routes
app.use(API_PREFIX + "/user", userRouter);
app.use(API_PREFIX, roleRequestRouter);
app.use(API_PREFIX + "/article", articleRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

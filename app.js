require("dotenv").config();
const express = require("express");
const app = express();
const httpPort = process.env.PORT;
const morgan = require("morgan");
const { logger, stream } = require("./middleware/logger");
const kakaoRouter = require("./kakao-auth/kakao/kakao");
const passportKakao = require("./kakao-auth");
const { swaggerUi, specs } = require("./swagger/swagger");
const connect = require("./schemas/index.schemas");
const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");
const reviewRouter = require("./routes/review.router");
const mypageRouter = require("./routes/mypage.router");
const likeRouter = require("./routes/like.router");
const followRouter = require("./routes/follow.router");
const chatRouter = require("./routes/chat.router");
const cors = require("cors");

//접속로그 남기기
const requestMiddleware = (req, res, next) => {
  console.log(
    "ip:",
    req.ip,
    "domain:",
    req.rawHeaders[1],
    "method:",
    req.method,
    "Request URL:",
    req.originalUrl,
    "-",
    new Date()
  );
  next();
};

passportKakao();
connect();

app.use(cors());
app.use(express.json());
app.use(requestMiddleware);
app.use(morgan("combined", { stream }));
app.use("/oauth", kakaoRouter);
app.use("/", [
  userRouter,
  reviewRouter,
  mypageRouter,
  likeRouter,
  postRouter,
  followRouter,
  chatRouter,
]);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//로드밸런서 헬스체크
app.get("/", (req, res) => {
  return res.send("good");
});

app.listen(httpPort, () => {
  console.log("http " + httpPort + " server start");
});

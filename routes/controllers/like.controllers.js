const express = require("express");
const { create } = require("../../schemas/like.schemas");
const Review = require("../../schemas/review.schemas");
const Like = require("../../schemas/like.schemas");
const User = require("../../schemas/user.schemas");
const { logger, stream } = require("../../middleware/logger");
// //좋아요 추가,삭제
const like = async (req, res) => {
  try {
    //reviewId받는다
    const { reviewid } = req.params;
    //유저 정보 받기
    const { user } = res.locals;
    const { userId } = user;

    //유저 정보가 있는 지 확인
    if (userId > 0) {
      //사용유저가 같은 리뷰에 좋아요를 했는지 확인
      const like = await Like.find({ reviewId: reviewid, userId });

      if (like.length > 0) {
        //일치하는 값이 있으면 삭제
        await Like.deleteOne({ reviewId: reviewid, userId });
        await User.updateOne({ userId }, { $pull: { myLike: reviewid } });
        //남은 개수
        const totalLike = (await Like.find({ reviewId: reviewid })).length;
        // Review 스키마에 likeCnt값 - 1 해줌.
        await Review.updateOne(
          { reviewId: reviewid },
          { $inc: { likeCnt: -1 } }
        );
        return res.status(200).json({ result: "success", totalLike });
      }

      // 일치 하는 값이 없을 시 생성
      await Like.create({ userId, reviewId: reviewid });
      // 총갯수
      const totalLike = (await Like.find({ reviewId: reviewid })).length;
      // Review 스키마에 likeCnt값 + 1 해줌.
      await Review.updateOne({ reviewId: reviewid }, { $inc: { likeCnt: 1 } });
      return res.status(200).json({ result: "success", totalLike });
    }
    return res.status(401).json({
      response: "fail",
      msg: "유효하지 않은 토큰입니다",
    });
  } catch (error) {
    logger.error("like");
    res.status(400).json({
      response: "fail",
      msg: "알수 없는 오류가 발생했습니다.",
    });
  }
};

//내가 좋아요한 reviewList 보내기
const likeList = async (req, res) => {
  try {
    //유저 정보가 있는지 확인
    const { user } = res.locals;
    const { userId } = user;

    // 유저정보가 유효한지 확인
    if (userId > 0) {
      const like = await Like.find({ userId }, "reviewId");
      const likeList = [];
      for (let i = 0; i < like.length; i++) {
        likeList.push(like[i].reviewId);
      }
      return res.status(200).json({ result: "success", likeList });
    }
    return res.status(401).json({
      response: "fail",
      msg: "유효하지 않은 토큰입니다",
    });
  } catch (error) {
    logger.error("like");
    res.status(400).json({
      response: "fail",
      msg: "알수 없는 오류가 발생했습니다.",
    });
  }
};

module.exports = {
  like,
  likeList,
};

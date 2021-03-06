const User = require("../../schemas/user.schemas");
const Follow = require("../../schemas/follow.schemas");
const { logger, stream } = require("../../middleware/logger");

//follow
const addfollow = async (req, res) => {
  try {
    //내가 팔로우 하려는 유저
    const { followid } = req.params;
    //내 유저 아이디
    const { userId } = res.locals.user;
    //follow DB에 본인이 팔로우한 유저정보가 있는지
    const found = await Follow.findOne({ userId, followId: followid });
    const myFollow = await User.findOne({ userId });
    const followUser = await User.findOne({ userId: followid });
    const followName = followUser.nickname;

    const profileImage = followUser.profileImage;
    if (!found) {
      //팔로우 하려는 유저 정보 저장
      const follow = await Follow.create({
        userId,
        followId: followid,
        followName,
        profileImage,
      });
      console.log("follow", follow);
      await myFollow.updateOne({ $inc: { followCnt: 1 } });
      await followUser.updateOne({ $inc: { followerCnt: 1 } });

      res.send({ success: true, msg: "팔로잉" });
    } else {
      await Follow.deleteOne({ userId, followid });
      await myFollow.updateOne({ $inc: { followCnt: -1 } });
      await followUser.updateOne({ $inc: { followerCnt: -1 } });
      res.send({ success: true, msg: "팔로우 취소" });
    }
  } catch {
    logger.error("follow");
    res.status(400).send("Error");
  }
};

//내 팔로우 리스트 조회
const myFollow = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const follow = await Follow.find(
      { userId },
      "followId followName profileImage"
    );

    res.status(200).json({ success: true, data: follow });
  } catch (err) {
    logger.error("follow");
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//내 팔로워 리스트 조회
const myFollower = async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const follow = await Follow.find({ followId: userId }, "userId");
    followerlist = [];
    for (let i = 0; i < follow.length; i++) {
      followerlist.push(follow[i].userId);
    }
    const follower = await User.find(
      { userId: followerlist },
      "userId nickname profileImage"
    );

    res.status(200).json({ success: true, data: follower });
  } catch (err) {
    logger.error("follow");
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//다른 유저 팔로우 리스트 조회
const follow = async (req, res) => {
  try {
    const { userid } = req.params;
    const follow = await Follow.find(
      { userId: userid },
      "followId followName profileImage"
    );

    res.status(200).json({ success: true, data: follow });
  } catch (err) {
    logger.error("follow");
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//다른 유저 팔로워 리스트 조회
const follower = async (req, res) => {
  try {
    const { userid } = req.params;
    const follow = await Follow.find({ followId: userid }, "userId");
    followerlist = [];
    for (let i = 0; i < follow.length; i++) {
      followerlist.push(follow[i].userId);
    }
    const follower = await User.find(
      { userId: followerlist },
      "userId nickname profileImage"
    );

    res.status(200).json({ success: true, data: follower });
  } catch (err) {
    logger.error("follow");
    res.status(400).send("팔로우 목록 조회 실패");
  }
};

//팔로워 삭제
const deleteFollower = async (req, res) => {
  try {
    const { userid } = req.params;
    const myId = res.locals.user.userId;
    const followers = await Follow.findOne({ userid, followId: myId });
    console.log(followers);
    if (followers) {
      await Follow.deleteOne({ userId: userid, followId: myId });
      await User.updateOne({ userId: userid }, { $inc: { followCnt: -1 } });
      await User.updateOne({ userId: myId }, { $inc: { followerCnt: -1 } });
      return res.status(200).json({ success: true, msg: "삭제완료" });
    } else {
      return res.status(400).send({ msg: "이미 삭제되었습니다." });
    }
  } catch (err) {
    logger.error("follow");
    res.status(400).send("팔로워 삭제 실패");
  }
};

module.exports = {
  addfollow,
  follow,
  follower,
  myFollow,
  myFollower,
  deleteFollower,
};

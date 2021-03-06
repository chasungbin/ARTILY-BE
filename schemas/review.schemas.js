const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  category: {
    type: String,
    // required: true,
  },
  userId: {
    type: String,
    // required: true,
  },
  nickname: {
    type: String,
    //   required: true,
  },
  profileImage: {
    type: String,
  },
  reviewId: {
    type: String,
    //  required: true,
  },
  postId: {
    type: String,
    //  required: true,
  },
  reviewTitle: {
    type: String,
    //  required: true,
  },
  reviewContent: {
    type: String,
    //  required: true,
  },
  likeCnt: {
    type: Number,
    default: 0,
  },
  images: {
    type: Array,
  },
  imageUrl: {
    type: Array,
  },
  createdAt: {
    type: String,
    //   required: true,
  },
  seller: {
    type: Object,
    //   required: true,
  },
});
module.exports = mongoose.model("Review", ReviewSchema);

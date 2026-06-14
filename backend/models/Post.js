const mongoose = require('mongoose');
//this is mongodb schema  for comment 
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  name: String,
  text: { type: String, required: true },
}, { timestamps: true });

//this is like schema for mongodb
const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  name: String,
});

//this is whole post schema like and comment are aslo stored in this post schema 
const postSchema = new mongoose.Schema({
  author: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    name: { type: String, required: true }
  },
  text: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  likes: [likeSchema],
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
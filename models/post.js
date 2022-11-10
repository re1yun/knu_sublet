//models/post.js

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title:{type:String, required:true},     //제목
    body:{type:String, required:true},      //본문 글 내용
    location:{type:String, required:true},  //북문,쪽문,정문,텍문,수영장문,서문 등등
    writtenBy:{type:String, required:true}, //작성한 사람
    createdAt:{type:Date, default:Date.now},//작성한 시각
    updatedAt:{type:Date}                   //수정한 시각
});

module.exports = mongoose.model('post', postSchema);
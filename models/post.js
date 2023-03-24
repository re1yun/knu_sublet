//models/post.js

var mongoose = require("mongoose");
var Count = require("./count")
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title:{type:String, required:[true, 'Title is required!']},     //제목
    body:{type:String, required:[true, 'Body is required!']},        //본문 글 내용
    location:{type:String, required:[true, 'Location is required!']},//북문,쪽문,정문,텍문,수영장문,서문
    author:{type:mongoose.Schema.Types.ObjectId, ref: 'user', required:true}, //작성한 사람
    views:{type:Number, default:0},         //조회수
    index:{type:Number},                    //인덱스
    attachment:[{type:mongoose.Schema.Types.ObjectId, ref:'file', default:[]}],       //파일id들
    createdAt:{type:Date, default:Date.now},//작성한 시각
    updatedAt:{type:Date}                   //수정한 시각
});

// 각 게시물마다 인덱스 설정해주는 함수
postSchema.pre('save', async function (next){
    var post = this;
    if(post.isNew){
        var count = await Count.findOne({name:'post'}).exec();
        if(!count) count = await Count.create({name:'post'});
        count.cnt++;
        count.save();
        post.index = count.cnt;
    }
    return next();
});

module.exports = mongoose.model('post', postSchema);
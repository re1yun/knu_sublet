//models/user.js

var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userID: {type:String, required:[true,'Username is required!'], unique:true},
  password: {type:String, required:[true,'Password is required!'], select:false},
  name:{type:String, required:[true,'Name is required!']},
  email:{type:String}
},{
  //밑줄은 나중에 디버깅시, console에서 virtual 항목들도 볼 수 있도록 해줌
    toObject:{virtuals:true}
});

//virtuals: db자체에는 저장이 안되지만, user 항목에서는 접근 가능함
userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; })
;

userSchema.virtual('originalPassword')
  .get(function(){ return this._originalPassword; })
  .set(function(value){ this._originalPassword=value; })
;

userSchema.virtual('currentPassword')
  .get(function(){ return this._currentPassword; })
  .set(function(value){ this._currentPassword=value; })
;

userSchema.virtual('newPassword')
  .get(function(){ return this._newPassword; })
  .set(function(value){ this._newPassword=value; })
;

//'save'전마다 호출됨.
userSchema.pre('save', function (next){
  var user = this;

  if(!user.isModified('password')){ // 3-1
    return next();
  }
  else {
    user.password = bcrypt.hashSync(user.password); //3-2
    return next();
  }
});

userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

// password validation
userSchema.path('password').validate(function(v) {
  var user = this;

  // create user
  if(user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }
  
    if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
  
  // update user
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }

    if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});

module.exports = mongoose.model('user', userSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// username과 password 필드를 추가하고 몇 가지 메소드를 추가해준다.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
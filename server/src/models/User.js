
import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs'; 
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String, 
    password: String,
    createdAt: {
        default: Date.now(), 
        type: Date
    }, 
    role: String,
});

UserSchema.pre('save', async function (next){
    const user = this;
    if(!user.isModified('password')) return next();

    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

const User = mongoose.model('User', UserSchema);
export default User;
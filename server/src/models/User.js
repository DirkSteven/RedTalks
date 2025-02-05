
import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs'; 
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
    }, 
    password: String,
    createdAt: {
        default: Date.now(), 
        type: Date
    }, 
    imageUrl: String,
    failedAttempts: { type: Number, default: 0 },
    lockoutTime: { type: Date, default: null },
    verified: {
        type: Boolean,
        default: false,
      },      
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
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
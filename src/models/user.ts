// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    createdAt: Date;
    watchList:[],
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    watchList: { type: Array },
});

// Export the model with the `IUser` interface
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
export type { IUser };

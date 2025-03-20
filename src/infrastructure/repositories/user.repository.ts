import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/models/user.entity";
import mongoose, { Document, Schema } from "mongoose";

interface IUserModel extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  firstLogin: boolean;
  temporaryPassword: string;
  temporaryPasswordExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    firstLogin: { type: Boolean, default: true },
    temporaryPassword: { type: String, required: false },
    temporaryPasswordExpiresAt: { type: Date, required: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUserModel>("User", UserSchema);

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const created = (await UserModel.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      firstLogin: user.firstLogin,
      temporaryPassword: user.temporaryPassword,
      temporaryPasswordExpiresAt: user.temporaryPasswordExpiresAt,
    })) as IUserModel;
    return new User(
      (created._id as mongoose.Types.ObjectId).toString(),
      created.firstName,
      created.lastName,
      created.email,
      created.password,
      created.firstLogin,
      created.temporaryPassword,
      created.temporaryPasswordExpiresAt,
      created.createdAt,
      created.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return new User(
      (user._id as IUserModel).toString(),
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.firstLogin,
      user.temporaryPassword,
      user.temporaryPasswordExpiresAt,
      user.createdAt,
      user.updatedAt
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return new User(
      (user._id as IUserModel).toString(),
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.firstLogin,
      user.temporaryPassword,
      user.temporaryPasswordExpiresAt,
      user.createdAt,
      user.updatedAt
    );
  }

  async update(user: User): Promise<User> {
    const updated = await UserModel.findByIdAndUpdate(
      user._id,
      {
        email: user.email,
        password: user.password,
        firstLogin: user.firstLogin,
        temporaryPassword: user.temporaryPassword,
        temporaryPasswordExpiresAt: user.temporaryPasswordExpiresAt,
      },
      { new: true }
    );
    if (!updated) throw new Error("User not found");
    return new User(
      (updated._id as IUserModel).toString(),
      updated.firstName,
      updated.lastName,
      updated.email,
      updated.password,
      updated.firstLogin,
      updated.temporaryPassword,
      updated.temporaryPasswordExpiresAt,
      updated.createdAt,
      updated.updatedAt
    );
  }
}

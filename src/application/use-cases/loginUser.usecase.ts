import { IUserRepository } from "../../domain/repositories/IUserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { loginUserSchema } from "../../validators/loginUser.validator";
import { User } from "../../domain/models/user.entity";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ token: string; user: Partial<User> }> {
    await loginUserSchema.validate({ email, password });

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Excluir campos sensibles como contraseña y temporales
    const {
      password: _,
      temporaryPassword,
      temporaryPasswordExpiresAt,
      ...userData
    } = user;

    return { token, user: userData };
  }
}

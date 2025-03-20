import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/models/user.entity";
import { registerUserSchema } from "../../validators/registerUser.validator";
import bcrypt from "bcryptjs";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<User> {
    await registerUserSchema.validate({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(
      null,
      firstName,
      lastName,
      email,
      hashedPassword,
      true,
      "",
      undefined,
      new Date(),
      new Date()
    );
    return await this.userRepository.create(user);
  }
}

import { IUserRepository } from "../../domain/repositories/IUserRepository";
import bcrypt from "bcryptjs";
import { changePasswordWithTokenSchema } from "../../validators/changePasswordWithToken.validator";

export class ChangePasswordWithTokenUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await changePasswordWithTokenSchema.validate({
      password,
      confirmPassword,
    });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.temporaryPassword = "";
    user.temporaryPasswordExpiresAt = undefined;
    user.firstLogin = false;
    await this.userRepository.update(user);
  }
}

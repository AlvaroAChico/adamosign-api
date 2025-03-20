import { IUserRepository } from "../../domain/repositories/IUserRepository";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "../../validators/changePassword.validator";
import { sendPasswordUpdatedEmail } from "../services/email.service";

export class ChangePasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    email: string,
    temporaryPassword: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await changePasswordSchema.validate({
      email,
      temporaryPassword,
      password,
      confirmPassword,
    });

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User does not exist");
    }

    if (!user.temporaryPassword || !user.temporaryPasswordExpiresAt) {
      throw new Error("Temporary password not set. Please verify OTP first");
    }

    if (user.temporaryPassword !== temporaryPassword) {
      throw new Error("Invalid temporary password");
    }

    if (new Date() > user.temporaryPasswordExpiresAt) {
      throw new Error("Temporary password has expired");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.temporaryPassword = "";
    user.temporaryPasswordExpiresAt = undefined;
    user.firstLogin = false;

    await this.userRepository.update(user);

    await sendPasswordUpdatedEmail(email);
  }
}

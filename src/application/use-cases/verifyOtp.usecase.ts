import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { verifyOtpSchema } from "../../validators/verityOtp.validator";
import { generateOTP } from "../../utils/generateOTP";

export class VerifyOtpUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository
  ) {}

  async execute(
    email: string,
    code: string
  ): Promise<{ temporaryPassword: string; temporaryPasswordExpiresAt: Date }> {
    await verifyOtpSchema.validate({ email, code });

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User does not exist");
    }
    const otpRecord = await this.otpRepository.findByUserIdAndCode(
      user._id as string,
      code
    );

    if (!otpRecord) {
      throw new Error("Invalid OTP");
    }
    if (otpRecord.expiresAt < new Date()) {
      throw new Error("OTP has expired");
    }

    await this.otpRepository.deleteById(otpRecord.id as string);

    const temporaryPassword = generateOTP(8);
    const temporaryPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    (user as any).temporaryPassword = temporaryPassword;
    (user as any).temporaryPasswordExpiresAt = temporaryPasswordExpiresAt;

    // Actualiza el usuario en la base de datos
    await this.userRepository.update(user);

    return { temporaryPassword, temporaryPasswordExpiresAt };
  }
}

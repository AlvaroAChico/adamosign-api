import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { Otp } from "../../domain/models/otp.entity";
import { generateOTP } from "../../utils/generateOTP";
import { sendOtpEmail } from "../services/email.service";
import { resendOtpSchema } from "../../validators/resendOtp.validator";

export class ResendOtpUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository
  ) {}

  async execute(email: string): Promise<void> {
    await resendOtpSchema.validate({ email });

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User does not exist");
    }
    const otpCode = generateOTP();
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRATION_MINUTES || "15") * 60000
    );
    const otp = new Otp(null, user._id as string, otpCode, 1, expiresAt);
    await this.otpRepository.upsert(otp);
    await sendOtpEmail(email, otpCode, true);
  }
}

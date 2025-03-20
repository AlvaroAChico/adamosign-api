import * as yup from "yup";

export const verifyOtpSchema = yup.object().shape({
  code: yup.string().required("Code is required"),
});

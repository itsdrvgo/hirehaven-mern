export interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface OtpData {
    otp: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    password: string;
    confirmPassword: string;
}

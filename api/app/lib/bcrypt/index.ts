import bcrypt from "bcryptjs";

export async function hashPassword(password: string, salt = 10) {
    return await bcrypt.hash(password, salt);
}

export async function comparePasswords(
    password: string,
    hashedPassword: string
) {
    return await bcrypt.compare(password, hashedPassword);
}

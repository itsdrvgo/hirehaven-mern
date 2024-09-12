import jwt, { type JwtPayload } from "jsonwebtoken";
import type { DefaultPayload } from "../../interfaces/index.js";
import type { Request } from "express";

export function signJWT<T extends JwtPayload = DefaultPayload>(
    payload: T,
    secret: string,
    expiresIn: string
) {
    return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt<T extends JwtPayload = DefaultPayload>(
    token: string,
    secret: string
): T {
    return jwt.verify(token, secret) as T;
}

export function decodeJwt<T extends JwtPayload = DefaultPayload>(
    token: string
): T {
    return jwt.decode(token) as T;
}

export function getTokenFromHeader(req: Request) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    return token;
}

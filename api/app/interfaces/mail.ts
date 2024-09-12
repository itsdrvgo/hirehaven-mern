import nodemailer from "nodemailer";
import type SMTPPool from "nodemailer/lib/smtp-pool/index.js";

export type Transporter = nodemailer.Transporter<SMTPPool.SentMessageInfo>;

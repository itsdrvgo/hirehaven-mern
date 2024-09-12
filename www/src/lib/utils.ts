import { DEFAULT_ERROR_MESSAGE, UserRoles } from "@/config/const";
import { init } from "@paralleldrive/cuid2";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { NextResponse } from "next/server";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { ResponseMessages } from "./validation/response";

export function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getAbsoluteURL(path: string = "/") {
    if (process.env.VERCEL_URL)
        return "https://" + process.env.VERCEL_URL + path;
    return "http://localhost:" + (process.env.PORT ?? 3000) + path;
}

export function handleClientError(error: unknown, toastId?: string | number) {
    if (error instanceof ZodError)
        return toast.error(error.issues.map((x) => x.message).join(", "), {
            id: toastId,
        });
    else if (error instanceof AxiosError)
        return toast.error(error.response?.data.longMessage ?? error.message, {
            id: toastId,
        });
    else if (error instanceof Error) {
        console.error(error);
        return toast.error(error.message, {
            id: toastId,
        });
    } else {
        console.error(error);
        return toast.error(DEFAULT_ERROR_MESSAGE, {
            id: toastId,
        });
    }
}

export function handleError(err: unknown) {
    console.error(err);
    if (err instanceof ZodError)
        return NextResponse.json({
            code: 422,
            message: err.issues.map((x) => x.message).join(", "),
        });
    else
        return NextResponse.json({
            code: 500,
            message: "Internal Server Error!",
        });
}

export async function cFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
}

export function CResponse<T>({
    message,
    longMessage,
    data,
}: {
    message: ResponseMessages;
    longMessage?: string;
    data?: T;
}) {
    let code: number;
    let status = false;

    switch (message) {
        case "OK":
            code = 200;
            status = true;
            break;
        case "ERROR":
            code = 400;
            break;
        case "UNAUTHORIZED":
            code = 401;
            break;
        case "FORBIDDEN":
            code = 403;
            break;
        case "NOT_FOUND":
            code = 404;
            break;
        case "BAD_REQUEST":
            code = 400;
            break;
        case "CONFLICT":
            code = 409;
            break;
        case "TOO_MANY_REQUESTS":
            code = 429;
            break;
        case "INTERNAL_SERVER_ERROR":
            code = 500;
            break;
        case "SERVICE_UNAVAILABLE":
            code = 503;
            break;
        case "GATEWAY_TIMEOUT":
            code = 504;
            break;
        case "UNKNOWN_ERROR":
            code = 500;
            break;
        case "UNPROCESSABLE_ENTITY":
            code = 422;
            break;
        case "NOT_IMPLEMENTED":
            code = 501;
            break;
        case "CREATED":
            code = 201;
            status = true;
            break;
        case "BAD_GATEWAY":
            code = 502;
            break;
        default:
            code = 500;
            break;
    }

    return NextResponse.json(
        {
            status,
            message,
            longMessage,
            data,
        },
        {
            status: code,
            statusText: message,
        }
    );
}

export function parseToJSON<T>(data: string): T {
    return JSON.parse(data);
}

export function getAuthToken(cookies: CookieTypes, role?: UserRoles) {
    const { admin, poster, seeker } = cookies;

    return role === "admin"
        ? `Bearer ${admin}`
        : role === "poster"
          ? `Bearer ${poster}`
          : `Bearer ${seeker}`;
}

export function convertBytesIntoHumanReadable(bytes: number) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

export function generateId(
    {
        length = 8,
        casing = "normal",
    }: {
        length?: number;
        casing?: "upper" | "lower" | "normal";
    } = { length: 8, casing: "normal" }
) {
    const id = init({
        length,
    })();

    switch (casing) {
        case "upper":
            return id.toUpperCase();
        case "lower":
            return id.toLowerCase();
        default:
            return id;
    }
}

export function slugify(text: string, separator: string = "-") {
    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, separator);
}

export function generateZodEnumFromObject<T extends string>(
    objects: PropertyObject<T>
): [T, ...T[]] {
    return [objects[0].value, ...objects.slice(1).map((p) => p.value)];
}

export function sanitizeContent(text: string) {
    return text
        .replace(/####(.*?)\n/g, "<h4>$1</h4>\n")
        .replace(/###(.*?)\n/g, "<h3>$1</h3>\n")
        .replace(/##(.*?)\n/g, "<h2>$1</h2>\n")
        .replace(/#(.*?)\n/g, "<h1>$1</h1>\n")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/_(.*?)_/g, "<u>$1</u>")
        .replace(/\\n/g, "<br/>")
        .replace(/\n/g, "<br/>")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
}

export function calculateTimeDifference(
    date: Date,
    display: "full" | "mini" = "mini"
) {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60)
        return display === "full"
            ? `${minutes} minutes ago`
            : `${minutes}m ago`;
    if (hours < 24)
        return display === "full" ? `${hours} hours ago` : `${hours}h ago`;
    if (days < 7)
        return display === "full" ? `${days} days ago` : `${days}d ago`;

    const sameYear = now.getFullYear() === past.getFullYear();
    return sameYear ? format(past, "MMM d") : format(past, "MMM d, yyyy");
}

export function convertValueToLabel(value: string) {
    return value
        .split(/[_-\s]/)
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ");
}

export function formatNumber(number: number, decimals = 1) {
    const SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
    const tier = (Math.log10(number) / 3) | 0;

    if (tier === 0) return number;

    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;

    if (scaled % 1 === 0) return scaled + suffix;
    return scaled.toFixed(decimals) + suffix;
}

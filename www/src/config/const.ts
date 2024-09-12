import { env } from "@/../env.mjs";
import { slugify } from "@/lib/utils";

export const DEFAULT_ERROR_MESSAGE = "Something went wrong, try again later!";
export const DEFAULT_USER_PENDING_MESSAGE =
    "Please wait while we fetch your data...";

export const DEFAULT_AVATAR_PATH = "uploads/images/avatars/default_avatar.png";

export const TOKENS = {
    SEEKER_TOKEN: "hirehaven__seeker_KkasdmnJ2jifa_654128",
    POSTER_TOKEN: "hirehaven__poster_KkasdmnJ2jifa_654128",
    ADMIN_TOKEN: "hirehaven__admin_KkasdmnJ2jifa_654128",
} as const;

export const MAX_IMAGE_COUNT = 1;
export const MAX_IMAGE_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
];

export const MAX_DOC_COUNT = 1;
export const MAX_DOC_FILE_SIZE = 8 * 1024 * 1024; // 8MB
export const ACCEPTED_DOC_TYPES = ["application/pdf"];

export const DEFAULT_FILTERS = {
    category: "",
    type: [] as JobTypes[],
    country: "",
    name: "",
    location: [] as LocationTypes[],
    salaryRange: [0, 300_000],
};

export const contactQueries = [
    "Help & Support",
    "Become a Poster",
    "Hacked Account",
    "Bug Reporting",
    "Feature Request",
    "Others",
].map((query) => ({
    label: query,
    value: slugify(query),
    disabled: slugify(query) !== slugify("Become a Poster"),
}));

export const PAGES = {
    FRONTEND: {
        BASE: "http://localhost:3000",
        SIGNUP: "/auth/signup",
        SIGNIN: {
            SEEKER: "/auth/signin",
            POSTER: "/auth/signin?type=poster",
            ADMIN: "/auth/signin?type=admin",
        },
        VERIFY_EMAIL: "/auth/verify-email",
        LEGAL: {
            PRIVACY_POLICY: "/legal/privacy",
            TERMS_OF_SERVICE: "/legal/terms",
        },
        ADMIN: {
            BASE: "/admin",
            DASHBOARD: "/admin/dashboard",
        },
        POSTER: {
            BASE: "/poster",
            DASHBOARD: "/poster/dashboard",
            JOBS: {
                BASE: "/poster/jobs",
                CREATE: "/poster/jobs/create",
            },
        },
    },
    BACKEND: {
        BASE: env.NEXT_PUBLIC_BACKEND_URL,
        API: {
            BASE: "/api",
            SIGNUP: "/api/auth/signup",
            SIGNIN: {
                SEEKER: "/api/auth/signin",
                POSTER: "/api/auth/signin?type=poster",
                ADMIN: "/api/auth/signin?type=admin",
            },
            SIGNOUT: {
                SEEKER: "/api/auth/signout",
                POSTER: "/api/auth/signout?type=poster",
                ADMIN: "/api/auth/signout?type=admin",
            },
            ME: "/api/auth/me",
            VERIFY_EMAIL: "/api/auth/verify-email",
            RESEND_VERIFICATION_EMAIL: "/api/auth/resend-verification-email",
            COOKIES: "/api/cookies",
            USERS: {
                BASE: "/api/users",
            },
            CONTACT: "/api/contacts",
            JOBS: "/api/jobs",
            CATEGORIES: "/api/categories",
            APPLICATIONS: "/api/applications",
        },
    },
} as const;

export const ROLES = {
    ADMIN: "admin",
    POSTER: "poster",
    SEEKER: "seeker",
} as const;

export const JOB_TYPES = {
    FULL_TIME: "full_time",
    FREELANCE: "freelance",
    PART_TIME: "part_time",
    CONTRACT: "contract",
    INTERNSHIP: "internship",
} as const;

export const JOB_STATUSES = {
    PENDING: "draft",
    PUBLISHED: "published",
} as const;

export const LOCATION_TYPES = {
    ONSITE: "onsite",
    HYBRID: "hybrid",
    REMOTE: "remote",
} as const;

export const PAYMENT_MODES = {
    HOURLY: "hourly",
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
} as const;

export const APPLICATION_STATUSES = {
    PENDING: "pending",
    REVIEWED: "reviewed",
    REJECTED: "rejected",
    HIRED: "hired",
} as const;

export type UserRoles = ValueOf<typeof ROLES>;
export type JobTypes = ValueOf<typeof JOB_TYPES>;
export type JobStatuses = ValueOf<typeof JOB_STATUSES>;
export type LocationTypes = ValueOf<typeof LOCATION_TYPES>;
export type PaymentModes = ValueOf<typeof PAYMENT_MODES>;
export type ApplicationStatuses = ValueOf<typeof APPLICATION_STATUSES>;

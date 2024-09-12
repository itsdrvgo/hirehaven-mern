import { PAGES, UserRoles } from "@/config/const";
import axios from "axios";
import { getAuthToken } from "../utils";
import {
    AggregatedUserData,
    ResponseData,
    SafeUserData,
    SignInData,
    UpdateUserContactData,
    UpdateUserGeneralData,
    UpdateUserPasswordData,
    UpdateUserRoleData,
} from "../validation";

export async function getCurrentUser(cookies: CookieTypes, role?: UserRoles) {
    const { admin, poster, seeker } = cookies;

    const headers = {
        authorization: role
            ? getAuthToken(cookies, role)
            : `Bearer ${admin || poster || seeker}`,
    };

    const res = await axios.get<ResponseData<SafeUserData>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.ME}`,
        {
            headers,
            withCredentials: true,
        }
    );

    return res.data.data;
}

export async function verifyUserEmail(token: string) {
    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.VERIFY_EMAIL}?token=${token}`
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function resendVerificationEmail(cookies: CookieTypes) {
    const headers = {
        authorization: getAuthToken(cookies),
    };

    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.RESEND_VERIFICATION_EMAIL}`,
        {},
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function signUpUser(data: SignInData) {
    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.SIGNUP}`,
        data
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data;
}

export async function signInUser(data: SignInData, type?: "admin" | "poster") {
    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${
            PAGES.BACKEND.API.SIGNIN[
                type === "admin"
                    ? "ADMIN"
                    : type === "poster"
                      ? "POSTER"
                      : "SEEKER"
            ]
        }`,
        data,
        {
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function signOutUser(role: UserRoles, cookies: CookieTypes) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${
            PAGES.BACKEND.API.SIGNOUT[
                role === "admin"
                    ? "ADMIN"
                    : role === "poster"
                      ? "POSTER"
                      : "SEEKER"
            ]
        }`,
        {},
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function getUsers({
    role,
    pageParam,
    type,
    cookies,
}: {
    role: UserRoles;
    pageParam: number;
    type?: UserRoles;
    cookies: CookieTypes;
}) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const searchParams = new URLSearchParams({
        paginated: "true",
        page: pageParam.toString(),
        ...(type ? { type } : {}),
    }).toString();

    const res = await axios.get<ResponseData<AggregatedUserData>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}?${searchParams}`,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function updateUserAvatar(
    userId: string,
    role: UserRoles,
    cookies: CookieTypes,
    avatar?: File
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    if (!avatar) throw new Error("No image selected");

    const formData = new FormData();
    formData.append("avatar", avatar);

    const res = await axios.put<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}/${userId}/avatar`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                ...headers,
            },
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function updateUserResume(
    userId: string,
    role: UserRoles,
    cookies: CookieTypes,
    resume?: File
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    if (!resume) throw new Error("No file selected");

    const formData = new FormData();
    formData.append("resume", resume);

    const res = await axios.put<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}/${userId}/resume`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                ...headers,
            },
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function updateUserGeneralInfo(
    data: UpdateUserGeneralData,
    userId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.patch<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}/${userId}`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function updateUserContactInfo(
    data: UpdateUserContactData,
    userId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.patch<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}/${userId}`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function updateUserPassword(
    data: UpdateUserPasswordData,
    userId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.patch<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}/${userId}/password`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function updateUserRole(
    data: UpdateUserRoleData["role"],
    userId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.patch<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}/${userId}/role`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function updateUserRestriction(
    isRestricted: boolean,
    userId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.patch<
        ResponseData<{ user: { isRestricted: boolean } }>
    >(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}/${userId}`,
        { isRestricted },
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function deleteUser(
    userId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.delete<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.USERS.BASE}/${userId}`,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

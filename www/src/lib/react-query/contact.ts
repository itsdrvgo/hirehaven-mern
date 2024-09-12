import { PAGES, UserRoles } from "@/config/const";
import axios from "axios";
import { getAuthToken } from "../utils";
import {
    AggregatedContactData,
    CreateContactData,
    ResponseData,
} from "../validation";

export async function getContacts({
    pageParam,
    cookies,
    role,
}: {
    pageParam: number;
    cookies: CookieTypes;
    role?: UserRoles;
}) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const searchParams = new URLSearchParams({
        paginated: "true",
        page: pageParam.toString(),
    }).toString();

    const res = await axios.get<ResponseData<AggregatedContactData>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.CONTACT}?${searchParams}`,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function createContact(
    data: CreateContactData,
    cookies: CookieTypes,
    role: UserRoles
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.CONTACT}`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function deleteContact(
    id: string,
    cookies: CookieTypes,
    role: UserRoles
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.delete<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.CONTACT}/${id}`,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

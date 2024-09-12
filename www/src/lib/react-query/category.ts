import { PAGES, UserRoles } from "@/config/const";
import axios from "axios";
import { getAuthToken } from "../utils";
import {
    CategoryData,
    CreateCategoryData,
    ResponseData,
    UpdateCategoryData,
} from "../validation";

export async function getCategories() {
    const res = await axios.get<ResponseData<CategoryData[]>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.CATEGORIES}`
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function getCategory(id: string) {
    const res = await axios.get<ResponseData<CategoryData>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.CATEGORIES}/${id}`
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function createCategory(
    data: CreateCategoryData,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.CATEGORIES}`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function updateCategory(
    data: UpdateCategoryData,
    id: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.patch<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.CATEGORIES}/${id}`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function deleteCategory(
    id: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.delete<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.CATEGORIES}/${id}`,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

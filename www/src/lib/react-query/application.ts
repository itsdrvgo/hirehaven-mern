import { PAGES, UserRoles } from "@/config/const";
import axios from "axios";
import { getAuthToken } from "../utils";
import {
    AggregatedApplicationData,
    ResponseApplicationData,
    ResponseData,
    UpdateApplicationData,
} from "../validation";

export async function getApplications({
    params,
    pageParam,
    cookies,
    role,
}: {
    params: {
        applicantId?: string;
        jobId?: string;
    };
    pageParam: number;
    cookies: CookieTypes;
    role?: UserRoles;
}) {
    const { admin, poster, seeker } = cookies;

    const headers = {
        authorization: role
            ? getAuthToken(cookies, role)
            : `Bearer ${admin || poster || seeker}`,
    };

    const searchParams = new URLSearchParams({
        ...(params.applicantId ? { aId: params.applicantId } : {}),
        ...(params.jobId ? { jId: params.jobId } : {}),
        paginated: "true",
        page: pageParam.toString(),
    }).toString();

    const res = await axios.get<ResponseData<AggregatedApplicationData>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.APPLICATIONS}?${searchParams}`,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function getApplication(
    applicationId: string,
    cookies: CookieTypes,
    role?: UserRoles
) {
    const { admin, poster, seeker } = cookies;

    const headers = {
        authorization: role
            ? getAuthToken(cookies, role)
            : `Bearer ${admin || poster || seeker}`,
    };

    const res = await axios.get<ResponseData<ResponseApplicationData>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.APPLICATIONS}/${applicationId}`,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function updateApplication(
    data: UpdateApplicationData,
    id: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.patch<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.APPLICATIONS}/${id}`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

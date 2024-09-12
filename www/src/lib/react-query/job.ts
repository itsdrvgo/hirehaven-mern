import { PAGES, UserRoles } from "@/config/const";
import axios from "axios";
import { getAuthToken } from "../utils";
import {
    AggregatedJobData,
    ApplyJobData,
    CreateJobData,
    ResponseData,
    ResponseJobData,
    UpdateJobData,
    updateJobSchema,
} from "../validation";

export async function getJobs(params: {
    category?: string; // category id
    name?: string; // search keyword
    type?: string; // "full_time" | "freelance" | "part_time" | "contract" | "internship"
    location?: string; // "onsite" | "remote" | "hybrid"
    country?: string; // country code
    minSalary?: string;
    maxSalary?: string;
    isFeatured?: string; // only true
    status?: "draft" | "published";
    poster?: string; // job poster id
}) {
    const searchParams = new URLSearchParams(params).toString();

    const res = await axios.get<ResponseData<ResponseJobData[]>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.JOBS}?${searchParams}`
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function getInfiniteJobs({
    params,
    pageParam,
}: {
    params: {
        category?: string; // category id
        name?: string; // search keyword
        type?: string; // "full_time" | "freelance" | "part_time" | "contract" | "internship"
        location?: string; // "onsite" | "remote" | "hybrid"
        country?: string; // country code
        minSalary?: string;
        maxSalary?: string;
        isFeatured?: string; // only true
        status?: "draft" | "published";
        poster?: string; // job poster id
    };
    pageParam: number;
}) {
    const searchParams = new URLSearchParams({
        ...params,
        paginated: "true",
        page: pageParam.toString(),
    }).toString();

    const res = await axios.get<ResponseData<AggregatedJobData>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.JOBS}?${searchParams}`
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function getJob(jobId: string) {
    const res = await axios.get<ResponseData<ResponseJobData>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.JOBS}/${jobId}`
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
    return res.data.data;
}

export async function applyToJob(
    data: ApplyJobData,
    jobId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.JOBS}/${jobId}/apply`,
        data,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function createJob(
    data: CreateJobData & {
        logo?: File;
    },
    role: UserRoles,
    cookies: CookieTypes
) {
    if (data.logo === undefined) {
        delete data.logo;
    }

    const headers = {
        authorization: getAuthToken(cookies, role),
        "Content-Type": "multipart/form-data",
    };

    const formdata = new FormData();
    for (const key in data) {
        const value = (data as any)[key];

        if (typeof value === "object" && value instanceof File)
            formdata.append(key, value);
        else if (typeof value === "object")
            for (const nestedKey in value) {
                const nestedValue = value[nestedKey];
                formdata.append(`${key}[${nestedKey}]`, nestedValue);
            }
        else formdata.append(key, value);
    }

    const res = await axios.post<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.JOBS}`,
        formdata,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function updateJob(
    data: UpdateJobData,
    jobId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const body = updateJobSchema.parse(data);

    const res = await axios.patch<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.JOBS}/${jobId}`,
        body,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

export async function deleteJob(
    jobId: string,
    role: UserRoles,
    cookies: CookieTypes
) {
    const headers = {
        authorization: getAuthToken(cookies, role),
    };

    const res = await axios.delete<ResponseData>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.JOBS}/${jobId}`,
        {
            headers,
            withCredentials: true,
        }
    );

    if (!res.data.status) throw new Error(res.data.longMessage);
}

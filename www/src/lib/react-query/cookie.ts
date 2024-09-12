import { PAGES } from "@/config/const";
import axios from "axios";
import { ResponseData } from "../validation";

export async function getCookies() {
    const res = await axios.get<ResponseData<CookieTypes>>(
        `${PAGES.BACKEND.BASE}${PAGES.BACKEND.API.COOKIES}`,
        {
            withCredentials: true,
        }
    );

    return res.data.data;
}

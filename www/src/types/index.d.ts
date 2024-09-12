import { Icons } from "@/components/icons";
import { HTMLAttributes, ReactNode } from "react";

export type SiteConfig = {
    name: string;
    description: string;
    ogImage: string;
    keywords?: string[];
    links?: {
        [key: string]: string;
    };
};

export type GenericProps = HTMLAttributes<HTMLElement>;
export interface LayoutProps {
    children: ReactNode;
}

export interface Menu {
    name: string;
    href: string;
    isExternal?: boolean;
    icon: keyof typeof Icons;
}

export interface Review {
    image: string;
    title: string;
    content: string;
}

export interface City {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
}

export interface State {
    id: number;
    name: string;
    state_code: string;
    latitude: string;
    longitude: string;
    type: string | null;
    cities: City[];
}

export interface Country {
    id: number;
    name: string;
    iso3: string;
    iso2: string;
    numeric_code: string;
    phone_code: string;
    capital: string;
    currency: string;
    currency_name: string;
    region: string;
    latitude: string;
    longitude: string;
    states: State[];
}

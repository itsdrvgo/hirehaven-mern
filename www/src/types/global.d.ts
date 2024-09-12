interface ExtendedFile {
    id: string;
    url: string;
    file: File;
}

type ValueOf<T> = T[keyof T];

type CookieTypes = {
    seeker?: string;
    poster?: string;
    admin?: string;
};

type PropertyObject<T extends string> = {
    label: string;
    value: T;
}[];

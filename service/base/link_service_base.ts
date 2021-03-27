import Link from "../../interface/Link.ts";

export interface ILinkService {
    getAll: () => Promise<[Link]>;
    getByShort: (shortUrl: string) => Promise<Link>;
    getStatByShort: (shortUrl: string) => Promise<Link>;
    create: (fullUrl: string) => Promise<Link|null>;
}
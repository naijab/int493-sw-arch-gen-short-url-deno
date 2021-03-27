import Link from "../../model/Link.ts";

export interface ILinkRepository {
  getAll: () => Promise<[Link]>;
  getByShort: (shortUrl: string) => Promise<Link>;
  getStatByShort: (shortUrl: string) => Promise<Link>;
  create: (fullUrl: string) => Promise<Link | null>;
}

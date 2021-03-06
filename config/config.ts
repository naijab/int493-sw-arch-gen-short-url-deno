import "https://deno.land/x/dotenv/load.ts";

export const HOSTNAME = `${Deno.env.get('HOST')}:${Deno.env.get('PORT')}` || "http://localhost";
export const DATABASE_NAME = "project";
export const TABLE = {
    LINK: "link"
};
import type { InitArgs } from "../types/InitArgs.js";
import type { TokenResponse } from "../types/TokenResponse.js";

export async function refreshAccessTokens(args: InitArgs): Promise<TokenResponse> {
    const auth = `${args.client_id}:${args.client_secret}`;

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(auth)}`,
        },
        body: `grant_type=refresh_token&refresh_token=${args.refresh_token}`,
    });
    return await res.json();
}
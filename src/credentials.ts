import type { CredentialArgs } from "./types/CredentialArgs.js";

export class Credentials {
    #access_token: string;
    #refresh_token: string;
    #expires_in: number;
    #client_id: string;
    #client_secret: string;

    constructor(args: CredentialArgs) {
        this.#access_token = args.access_token;
        this.#refresh_token = args.refresh_token;
        this.#expires_in = args.expires_in;
        this.#client_id = args.client_id;
        this.#client_secret = args.client_secret;
    }

    setAccessToken(access_token: string): void {
        this.#access_token = access_token;
    }

    setRefreshToken(refresh_token: string): void {
        this.#refresh_token = refresh_token;
    }

    setExpiresIn(expires_in: number): void {
        this.#expires_in = expires_in;
    }

    setClientId(client_id: string): void {
        this.#client_id = client_id;
    }

    setClientSecret(client_secret: string): void {
        this.#client_secret = client_secret;
    }

    getAccessToken(): string {
        return this.#access_token;
    }

    getRefreshToken(): string {
        return this.#refresh_token;
    }
    
    getExpiresIn(): number {
        return this.#expires_in;
    }

    getClientId(): string {
        return this.#client_id;
    }

    getClientSecret(): string {
        return this.#client_secret;
    }
}
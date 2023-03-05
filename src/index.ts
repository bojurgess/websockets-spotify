import { Credentials } from "./credentials.js";
import { refreshAccessTokens } from "./helpers/refreshAccessTokens.js";
import { WebSocketServer } from "ws";
import type { CredentialArgs } from "./types/CredentialArgs.js";
import type { InitArgs } from "./types/InitArgs.js";

interface Message {
    timeout: number;
}

export class WebsocketServer {
    #wss: WebSocketServer;
    #credentials: Credentials;
    #dataTimeout;

    private constructor(args: CredentialArgs) {
      this.#credentials = new Credentials(args)

      this.setTokenTimeout();
      this.spawnWSServer();
    }

    static async init(args: InitArgs) {
        const response = await refreshAccessTokens(args);

        return new WebsocketServer({
            refresh_token: args.refresh_token,
            access_token: response.access_token,
            expires_in: response.expires_in,
            client_id: args.client_id,
            client_secret: args.client_secret,
        });
    }

    async getNowPlaying() {
        const res = await fetch(`https://api.spotify.com/v1/me/player/currently-playing?${new URLSearchParams({
            market: "US",
        })}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.#credentials.getAccessToken()}`
            },
        });
        return await res.json();
    }

    private setTokenTimeout() {
        setTimeout(async () => {
            await refreshAccessTokens({
                client_id: this.#credentials.getClientId(),
                client_secret: this.#credentials.getClientSecret(),
                refresh_token: this.#credentials.getRefreshToken(),
            }).then((response) => {
                this.#credentials.setAccessToken(response.access_token);
                this.#credentials.setExpiresIn(response.expires_in);

                this.setTokenTimeout();
            });
        }, this.#credentials.getExpiresIn() * 1000);
    }

    private setDataTimeout(timeout: number) {
        this.#dataTimeout = setTimeout(async () => {
            await this.getNowPlaying().then((response) => {
                this.#wss.clients.forEach((client) => {
                    console.log(JSON.stringify(response));
                    client.send(JSON.stringify(response));
                });

                this.setDataTimeout(timeout);
            })
        }, timeout)
    }

    private validateWSClient(message: JSON) {
        try {
            const json: Message = JSON.parse(message.toString());

            if (json.timeout) {
                return true
            } else {
                throw new Error("Invalid JSON");
            }
        } catch (e) {
            console.error(e);
        }
    }

    private spawnWSServer() {
        this.#wss = new WebSocketServer({ port: 8080 });

        this.#wss.on('connection', (ws) => {
            console.log("Client connected");

            ws.on('message', (message) => {
                console.log(`Received message => ${message}`);
                const isValid = this.validateWSClient(message);

                if (isValid) {
                    const json: Message = JSON.parse(message.toString());
                    this.setDataTimeout(json.timeout);
                }
            })

            ws.on('close', () => {
                clearTimeout(this.#dataTimeout);
                console.log("Client disconnected");
            })
        })
    }

}




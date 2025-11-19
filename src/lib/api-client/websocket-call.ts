type ErrorType = {
    message: string;
    code?: string | number;
    status?: number;
    errors?: Record<string, string[] | string> | string;
    cause?: unknown;
}

type WsData<T> = {
    success: boolean
    data?: T
    last_index?: number
    index: number
}

export class WebSocket_CALL<TSend, TStartReceive, TStreamReceive, TEndReceive> {
    private ws: WebSocket;
    private url: string;
    private messageQueue: TSend[] = [];
    private isOpen = false;

    constructor(
        url: string,
        private onStart: (msg: TStartReceive) => void,
        private onStream: (msg: TStreamReceive, index?: number, lastIndex?: number) => void,
        private onEnd: (msg: TEndReceive, last_index: number) => void,
        private onError: (code: string, message: string) => void,
        private onOpen?: () => void,
        private onClose?: () => void
    ) {
        this.url = url;
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log("Connect")
            this.isOpen = true;
            this.flushQueue();
            this.onOpen?.();
        };

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data) as WsData<TStartReceive | TStreamReceive | TEndReceive | ErrorType>;
                if (!msg.success) {
                    const err = (msg as any).data as Partial<ErrorType> | undefined;
                    const codeStr = err?.code != null ? String(err.code) : "UNKNOWN_ERROR";
                    const messageStr = typeof err?.message === "string" ? err.message : "Unknown error";
                    this.onError(codeStr, messageStr);
                    return;
                }

                // success=true branch
                if (msg.data == null) {
                    this.onError("INVALID_PAYLOAD", "Missing data in WebSocket message");
                    return;
                }

                if (msg.index == 0) {
                    this.onStart(msg.data as TStartReceive);
                } else if (msg.index == -1) {
                    this.onEnd(msg.data as TEndReceive, msg.last_index as number);
                } else {
                    this.onStream?.(msg.data as TStreamReceive, msg.index as number, msg.last_index as number);
                }
            } catch (e) {
                this.onError("PARSE_ERROR", e instanceof Error ? e.message : "Failed to parse WebSocket message");
            }
        };

        this.ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        this.ws.onclose = () => {
            this.isOpen = false;
            console.log("WebSocket closed:", url);
            this.onClose?.();
        };
    }

    send(data: TSend) {
        if (this.isOpen) {
            this.ws.send(JSON.stringify(data));
        } else {
            this.messageQueue.push(data); 
        }
    }

    private flushQueue() {
        this.messageQueue.forEach((msg) => this.send(msg));
        this.messageQueue = [];
    }

    close() {
        this.ws.close();
    }
}

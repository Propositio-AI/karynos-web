type ErrorType = {
    code: string
    message: string
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
        private onStream: (msg: TStreamReceive) => void,
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
                if(!msg.success){
                    // this.onError(msg.data.code, msg.data.message)
                }else{
                    if(msg.index == 0) this.onStart(msg.data as TStartReceive)
                    else if(msg.index == -1) this.onEnd(msg.data as TEndReceive, msg.last_index as number)
                    else this.onStream(msg.data as TStreamReceive)
                }
            } catch (e) {
                console.error(e);
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

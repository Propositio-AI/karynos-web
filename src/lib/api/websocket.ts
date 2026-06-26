import { ApiResponse } from "./types";

type WsData<T> = ApiResponse<T> & {
	last_index?: number;
	index: number;
};

export class WebSocketCall<TSend, TStartReceive, TStreamReceive, TEndReceive> {
	private ws: WebSocket;
	private messageQueue: TSend[] = [];
	private isOpen = false;

	constructor(
		url: string,
		private onStart: (msg: ApiResponse<TStartReceive>) => void | Promise<void>,
		private onStream: (msg: ApiResponse<TStreamReceive>) => void | Promise<void>,
		private onEnd: (msg: ApiResponse<TEndReceive>, lastIndex: number) => void | Promise<void>,
		private onError: (error: ApiResponse<null>) => void | Promise<void>,
		private onOpen?: () => void | Promise<void>,
		private onClose?: () => void | Promise<void>,
	) {
		this.ws = new WebSocket(url);

		this.ws.onopen = () => {
			this.isOpen = true;
			this.flushQueue();
			if (this.onOpen)
				Promise.resolve(this.onOpen()).catch((err) => console.error("onOpen error:", err));
		};

		this.ws.onmessage = (event) => {
			try {
				const msg = JSON.parse(event.data) as WsData<
					TStartReceive | TStreamReceive | TEndReceive | null
				>;
				if (!msg.success) {
					const errorResponse: ApiResponse<null> = {
						success: false,
						message: msg.message || ["Unknown error"],
						data: null,
					};
					Promise.resolve(this.onError(errorResponse)).catch((err) =>
						console.error("onError error:", err),
					);
				} else if (msg.index === 0) {
					const startMsg: ApiResponse<TStartReceive> = {
						success: msg.success,
						message: msg.message,
						data: msg.data as TStartReceive,
					};
					Promise.resolve(this.onStart(startMsg)).catch((err) =>
						console.error("onStart error:", err),
					);
				} else if (msg.index === -1) {
					const endMsg: ApiResponse<TEndReceive> = {
						success: msg.success,
						message: msg.message,
						data: msg.data as TEndReceive,
					};
					Promise.resolve(this.onEnd(endMsg, msg.last_index as number)).catch((err) =>
						console.error("onEnd error:", err),
					);
				} else {
					const streamMsg: ApiResponse<TStreamReceive> = {
						success: msg.success,
						message: msg.message,
						data: msg.data as TStreamReceive,
					};
					Promise.resolve(this.onStream(streamMsg)).catch((err) =>
						console.error("onStream error:", err),
					);
				}
			} catch (e) {
				console.error("Parse error:", e);
				const errorResponse: ApiResponse<null> = {
					success: false,
					message: [e instanceof Error ? e.message : "Parse error"],
					data: null,
				};
				Promise.resolve(this.onError(errorResponse)).catch((err) =>
					console.error("onError error:", err),
				);
			}
		};

		this.ws.onerror = (err) => {
			console.error("WebSocket error:", err);
			const errorResponse: ApiResponse<null> = {
				success: false,
				message: ["WebSocket connection error"],
				data: null,
			};
			Promise.resolve(this.onError(errorResponse)).catch((e) =>
				console.error("onError error:", e),
			);
		};

		this.ws.onclose = () => {
			this.isOpen = false;
			if (this.onClose)
				Promise.resolve(this.onClose()).catch((err) =>
					console.error("onClose error:", err),
				);
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

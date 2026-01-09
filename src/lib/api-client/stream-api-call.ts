type StreamConfig = {
  url: string;
  body?: any; // ★追加: 送信データ
  onChunk: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
};

export const streamApiCall = async ({ url, body, onChunk, onComplete, onError }: StreamConfig) => {
  // api-call.tsと同様、パス結合ロジックが必要ならここに書くか、呼び出し元で結合する
  // ここでは .env のベースURLを使う前提で書きます
//   const full_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
    const full_url = `http://localhost:${url}`;// 仮
  try {
    const response = await fetch(full_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined, // ★追加
    });

    if (!response.ok) {
      // エラーレスポンスの内容を取得して投げる
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    if (!response.body) throw new Error('Response body is null');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunkValue = decoder.decode(value, { stream: true });
        onChunk(chunkValue);
      }
    }

    if (onComplete) onComplete();

  } catch (error) {
    console.error('Stream error:', error);
    if (onError) onError(error instanceof Error ? error : new Error('Unknown error'));
  }
};
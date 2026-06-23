interface RequestConfig {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

type RequestResult =
  | {
    status: number;
    headers: Record<string, string>;
    body: string;
    time: number;
  }
  | {
    error: string;
    time: number;
  };

export async function executeRequest(config: RequestConfig): Promise<RequestResult> {
  const start = Date.now();

  try {

    const options: RequestInit = {
      method: config.method,
    }

    if (config.headers) {
      options.headers = config.headers;
    }

    if (config.body) {
      options.body = config.body
    }

    const response = await fetch(config.url, options);
  
    const text = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      status: response.status,
      headers,
      body: text,
      time: Date.now() - start,
    };
  } catch (error: unknown) {
    return {
      error: typeof error === "string" ? error: error instanceof Error ? error.message : "Network error",
      time: Date.now() - start,
    };
  }
}
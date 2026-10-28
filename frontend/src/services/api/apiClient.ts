export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr: unknown) {
    const rawMsg = networkErr instanceof Error ? networkErr.message : String(networkErr);
    const isFetchError =
      rawMsg.toLowerCase().includes('fetch') ||
      rawMsg.toLowerCase().includes('network') ||
      rawMsg.toLowerCase().includes('failed');

    const message = isFetchError
      ? `Cannot connect to backend server at ${url}. Please verify that Spring Boot is running on port 8080 and CORS is configured.`
      : `Network request error: ${rawMsg}`;

    const error: ApiError = {
      status: 0,
      message,
    };
    throw error;
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let fieldErrors: Record<string, string> | undefined;

    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorMessage = errorJson.message;
      }
      if (errorJson.fieldErrors) {
        fieldErrors = errorJson.fieldErrors;
      }
    } catch {
      // Ignore non-JSON error bodies
    }

    const error: ApiError = {
      status: response.status,
      message: errorMessage,
      fieldErrors,
    };
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

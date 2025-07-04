export interface TApiRequest<TBody> {
  httpMethod: "GET" | "POST" | "PUT" | "PATCH";
  path: string;
  body: TBody;
}

export const BASE_URL =
  process.env.SPACEX_API_v4_URL || "https://api.spacexdata.com/v4";

export async function apiFetch<TInput, TResponse>(
  route: string,
  method: "GET" | "POST" | "PUT" | "PATCH",
  body: TInput
): Promise<TResponse> {
  const fetchOptions: RequestInit = {
    method: method,
    headers: {},
  };

  if (method !== "GET" && body !== null) {
    fetchOptions.headers = {
      "Content-Type": "application/json",
    };
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${route}`, fetchOptions);

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || json.error || "API Error");
  }

  return json as TResponse;
}

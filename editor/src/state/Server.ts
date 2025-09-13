export const request = ({
  endpoint,
  body,
  method = 'GET',
  session,
  signal,
}: {
  endpoint: string;
  body?: any;
  method?: string;
  session?: string;
  signal?: AbortSignal;
}) => (
  fetch(`${__SERVER__}${endpoint}`, {
    headers: {
      ...(session ? { Authorization: `Bearer ${session}` } : {}),
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    method,
    signal,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const type = res.headers.get('content-type') || '';
      if (type.indexOf('application/json') === 0) {
        return res.json();
      }
      return res.arrayBuffer();
    })
);

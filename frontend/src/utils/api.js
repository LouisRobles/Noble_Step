const API_BASE = process.env.REACT_APP_API_URL || "";

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers || {};
  // Attach JSON header by default
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  // attach token if present
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const opts = {
    credentials: "include",
    ...options,
    headers,
  };

  if (
    opts.body &&
    typeof opts.body === "object" &&
    !(opts.body instanceof FormData)
  ) {
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, opts);
  const contentType = res.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) {
    const message =
      data && data.message
        ? data.message
        : (data && data.error) || res.statusText;
    const err = new Error(message || "API error");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export { apiFetch, API_BASE };

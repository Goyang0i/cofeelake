
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;


const envPath = path.join(ROOT, ".env");

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1] in process.env) continue;

    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[match[1]] = value;
  }
}


const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".ico": "image/x-icon"
};

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data));
}

async function readJSON(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 100_000) {
      throw new Error("Request body too large");
    }
  }
  return JSON.parse(body);
}

async function handleOrder(req, res) {
  if (req.method !== "POST") {
    return sendJSON(res, 405, { error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase settings in .env");
    return sendJSON(res, 500, {
      error: "Server configuration error: check local .env settings."
    });
  }

  try {
    const body = await readJSON(req);

    const response = await fetch(
      `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/rpc/create_coffee_order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ order_data: body })
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Supabase order request failed:", response.status, result);
      return sendJSON(res, 400, {
        error: "Could not save order. Please check the server terminal."
      });
    }

    return sendJSON(res, 201, result);
  } catch (error) {
    console.error("Order request error:", error);
    return sendJSON(res, 400, {
      error: "Invalid request or server error."
    });
  }
}

const server = http.createServer(async (req, res) => {
  let pathname;

  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname
    );
  } catch {
    return sendJSON(res, 400, { error: "Bad request" });
  }

  if (pathname === "/api/orders") {
    return handleOrder(req, res);
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    return res.end("Method not allowed");
  }

  if (pathname === "/") pathname = "/index.html";

  // Audio files are currently stored in public/sounds.
  const filePath = pathname.startsWith("/sounds/")
    ? path.resolve(ROOT, "public", "." + pathname)
    : path.resolve(ROOT, "." + pathname);

  const allowedRoots = [
    path.resolve(ROOT) + path.sep,
    path.resolve(ROOT, "public") + path.sep
  ];

  if (!allowedRoots.some((base) => filePath.startsWith(base))) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end("File not found");
    }

    res.writeHead(200, {
      "Content-Type":
        mimeTypes[path.extname(filePath).toLowerCase()] ||
        "application/octet-stream"
    });

    res.end(req.method === "HEAD" ? undefined : data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Coffee Lake is running at http://localhost:${PORT}`);
});

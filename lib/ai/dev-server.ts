/**
 * Minimal local-only HTTP server for exercising the feasibility route
 * without a running Next.js app. Node's built-in http module only — no
 * Express, no new runtime dependencies. Reuses app/api/feasibility/route.ts's
 * POST handler directly; no logic is duplicated here.
 *
 * Run: npm run dev:test
 */

import "dotenv/config";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { POST } from "../../app/api/feasibility/route";

const PORT = 4000;

function readRequestBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function sendWebResponse(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  res.setHeader("content-type", response.headers.get("content-type") ?? "application/json");
  const body = await response.text();
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/feasibility") {
      const bodyBuffer = await readRequestBody(req);
      const request = new Request(`http://localhost:${PORT}/api/feasibility`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: bodyBuffer.toString("utf8"),
      });

      const response = await POST(request);
      await sendWebResponse(res, response);
      return;
    }

    res.statusCode = 404;
    res.setHeader("content-type", "text/plain");
    res.end("Not found. POST JSON to /api/feasibility.");
  } catch (error) {
    console.error("dev-server: unexpected error handling request:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("Internal server error.");
  }
});

server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});

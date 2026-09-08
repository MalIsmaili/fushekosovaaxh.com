import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>FushëkosovaBB - Under maintenance</title>
<style>
  body { font-family: system-ui, sans-serif; background: #17181c; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 24px; }
  .card { max-width: 420px; }
  .emoji { font-size: 2.5rem; }
  h1 { font-size: 1.5rem; margin: 0.75rem 0 0.5rem; }
  p { color: rgba(255, 255, 255, 0.7); margin: 0; }
</style>
</head>
<body>
  <div class="card">
    <div class="emoji">🏀</div>
    <h1>FushëkosovaBB is under maintenance</h1>
    <p>We're making some quick fixes. Please check back shortly.</p>
  </div>
</body>
</html>`;

export function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === "true") {
    return new NextResponse(MAINTENANCE_HTML, {
      status: 503,
      headers: { "content-type": "text/html; charset=utf-8", "retry-after": "3600" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

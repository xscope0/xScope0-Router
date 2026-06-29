import {
  handleAntigravityGet,
  handleAntigravityPost,
} from "@/lib/antigravity-ide-lib";

export async function GET() {
  return handleAntigravityGet("antigravity-ide");
}

export async function POST(request) {
  return handleAntigravityPost("antigravity-ide", request);
}

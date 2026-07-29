import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Safe deploy check — reports whether Claude env is loaded.
 * Never returns the API key value.
 */
export async function GET() {
  const claudeConfigured = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
  const model =
    process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";

  return NextResponse.json({
    claudeConfigured,
    model,
  });
}

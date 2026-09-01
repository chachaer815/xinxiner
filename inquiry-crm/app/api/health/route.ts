import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    app: "ok",
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasAuthSecret: Boolean(process.env.AUTH_SECRET),
    database: "unknown"
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
    return NextResponse.json(checks);
  } catch (error) {
    checks.database = error instanceof Error ? error.message : "database check failed";
    return NextResponse.json(checks, { status: 500 });
  }
}

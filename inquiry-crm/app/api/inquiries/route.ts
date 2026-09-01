import { NextResponse } from "next/server";
import { canSeeAllData, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await requireUser();
  const inquiries = await prisma.inquiry.findMany({
    where: canSeeAllData(user.role) ? {} : { ownerId: user.id },
    include: { owner: { select: { id: true, name: true, email: true } } },
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json({ data: inquiries });
}

import { NextResponse } from "next/server";
import { canSeeAllData, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry || (!canSeeAllData(user.role) && inquiry.ownerId !== user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const followUps = await prisma.followUp.findMany({ where: { inquiryId: id }, include: { user: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: followUps });
}

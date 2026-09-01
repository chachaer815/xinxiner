"use server";

import bcrypt from "bcryptjs";
import { AccountStatus, FieldType, InquiryStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { canSeeAllData, requireRole, requireUser, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";

function stringOrNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function dateOrNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? new Date(text) : null;
}

export async function loginAction(_: unknown, formData: FormData) {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const data = schema.safeParse(Object.fromEntries(formData));
  if (!data.success) return { error: "请输入正确的邮箱和密码。" };
  const user = await signIn(data.data.email, data.data.password);
  if (!user) return { error: "账号不存在、已停用或密码错误。" };
  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut();
  redirect("/login");
}

export async function createInquiryAction(formData: FormData) {
  const user = await requireUser();
  const inquiry = await prisma.inquiry.create({
    data: {
      title: String(formData.get("title") ?? "").trim(),
      customerName: String(formData.get("customerName") ?? "").trim(),
      customerCompany: stringOrNull(formData.get("customerCompany")),
      contactPhone: stringOrNull(formData.get("contactPhone")),
      contactEmail: stringOrNull(formData.get("contactEmail")),
      source: stringOrNull(formData.get("source")),
      productInterest: stringOrNull(formData.get("productInterest")),
      estimatedAmount: Number(formData.get("estimatedAmount") || 0) || null,
      priority: Number(formData.get("priority") || 2),
      status: (String(formData.get("status") || "NEW") as InquiryStatus),
      nextFollowUpAt: dateOrNull(formData.get("nextFollowUpAt")),
      ownerId: canSeeAllData(user.role) ? String(formData.get("ownerId") || user.id) : user.id
    }
  });

  const fields = await prisma.customField.findMany({ where: { enabled: true } });
  for (const field of fields) {
    const value = stringOrNull(formData.get(`custom_${field.key}`));
    if (value) {
      await prisma.inquiryCustomValue.create({ data: { inquiryId: inquiry.id, fieldId: field.id, value } });
    }
  }

  revalidatePath("/dashboard");
  redirect(`/inquiries/${inquiry.id}`);
}

export async function addFollowUpAction(inquiryId: string, formData: FormData) {
  const user = await requireUser();
  const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
  if (!inquiry || (!canSeeAllData(user.role) && inquiry.ownerId !== user.id)) redirect("/dashboard");

  const nextFollowUpAt = dateOrNull(formData.get("nextFollowUpAt"));
  const status = String(formData.get("status") || inquiry.status) as InquiryStatus;
  await prisma.followUp.create({
    data: {
      inquiryId,
      userId: user.id,
      method: String(formData.get("method") || "电话"),
      content: String(formData.get("content") || ""),
      nextFollowUpAt
    }
  });
  await prisma.inquiry.update({ where: { id: inquiryId }, data: { nextFollowUpAt, status } });
  revalidatePath(`/inquiries/${inquiryId}`);
  revalidatePath("/dashboard");
}

export async function saveUserAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = stringOrNull(formData.get("id"));
  const password = stringOrNull(formData.get("password"));
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    role: String(formData.get("role") || "SALES") as Role,
    status: String(formData.get("status") || "ACTIVE") as AccountStatus,
    phone: stringOrNull(formData.get("phone")),
    department: stringOrNull(formData.get("department"))
  };

  if (id) {
    await prisma.user.update({
      where: { id },
      data: { ...payload, ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}) }
    });
  } else {
    await prisma.user.create({ data: { ...payload, passwordHash: await bcrypt.hash(password ?? "password123", 10) } });
  }
  revalidatePath("/admin/users");
}

export async function saveCustomFieldAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = stringOrNull(formData.get("id"));
  const payload = {
    label: String(formData.get("label") ?? "").trim(),
    key: String(formData.get("key") ?? "").trim(),
    type: String(formData.get("type") || "TEXT") as FieldType,
    required: formData.get("required") === "on",
    enabled: formData.get("enabled") !== "off",
    options: stringOrNull(formData.get("options")),
    sortOrder: Number(formData.get("sortOrder") || 0)
  };
  if (id) await prisma.customField.update({ where: { id }, data: payload });
  else await prisma.customField.create({ data: payload });
  revalidatePath("/admin/fields");
}

export async function saveWorkflowStageAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = stringOrNull(formData.get("id"));
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    description: stringOrNull(formData.get("description")),
    status: String(formData.get("status") || "NEW") as InquiryStatus,
    sortOrder: Number(formData.get("sortOrder") || 0),
    enabled: formData.get("enabled") !== "off"
  };
  if (id) await prisma.workflowStage.update({ where: { id }, data: payload });
  else await prisma.workflowStage.create({ data: payload });
  revalidatePath("/admin/workflows");
}

export async function saveSettingAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const key = String(formData.get("key") ?? "").trim();
  await prisma.systemSetting.upsert({
    where: { key },
    update: { value: String(formData.get("value") ?? ""), description: stringOrNull(formData.get("description")) },
    create: { key, value: String(formData.get("value") ?? ""), description: stringOrNull(formData.get("description")) }
  });
  revalidatePath("/admin/settings");
}

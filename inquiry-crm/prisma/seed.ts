import { PrismaClient, Role, InquiryStatus, FieldType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertUser(email: string, name: string, role: Role) {
  const passwordHash = await bcrypt.hash("password123", 10);
  return prisma.user.upsert({
    where: { email },
    update: { name, role, status: "ACTIVE", passwordHash },
    create: { email, name, role, passwordHash, phone: "13800000000" }
  });
}

async function main() {
  const admin = await upsertUser("admin@example.com", "IT 管理员", "ADMIN");
  const boss = await upsertUser("boss@example.com", "老板", "BOSS");
  const sales = await upsertUser("sales@example.com", "张业务", "SALES");

  for (const field of [
    { label: "客户等级", key: "customer_level", type: FieldType.SELECT, options: "A类,B类,C类", sortOrder: 1 },
    { label: "预计采购时间", key: "purchase_timeline", type: FieldType.DATE, sortOrder: 2 },
    { label: "竞争对手", key: "competitor", type: FieldType.TEXT, sortOrder: 3 }
  ]) {
    await prisma.customField.upsert({ where: { key: field.key }, update: field, create: field });
  }

  for (const stage of [
    { name: "新询盘", status: InquiryStatus.NEW, sortOrder: 1, description: "刚录入或刚分配的询盘" },
    { name: "跟进中", status: InquiryStatus.FOLLOWING, sortOrder: 2, description: "业务员正在沟通需求" },
    { name: "已报价", status: InquiryStatus.QUOTED, sortOrder: 3, description: "已发送报价方案" },
    { name: "成交", status: InquiryStatus.WON, sortOrder: 4, description: "已确认成交" },
    { name: "丢单", status: InquiryStatus.LOST, sortOrder: 5, description: "客户暂不采购或转向竞品" }
  ]) {
    await prisma.workflowStage.upsert({
      where: { id: `${stage.status.toLowerCase()}_stage` },
      update: stage,
      create: { id: `${stage.status.toLowerCase()}_stage`, ...stage }
    });
  }

  await prisma.systemSetting.upsert({
    where: { key: "overdue_hours" },
    update: { value: "24" },
    create: { key: "overdue_hours", value: "24", description: "超过下次跟进时间多少小时后标记为严重逾期" }
  });

  const inquiry = await prisma.inquiry.create({
    data: {
      title: "越南客户询价自动包装线",
      customerName: "Nguyen Van A",
      customerCompany: "VN Manufacturing Co.",
      contactEmail: "buyer@example.com",
      source: "官网表单",
      productInterest: "自动包装线",
      estimatedAmount: 68000,
      status: InquiryStatus.FOLLOWING,
      priority: 1,
      nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ownerId: sales.id
    }
  });

  await prisma.followUp.create({
    data: {
      inquiryId: inquiry.id,
      userId: sales.id,
      method: "电话",
      content: "已确认客户需要英文报价单和交期说明。",
      nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  });

  console.log({ admin: admin.email, boss: boss.email, sales: sales.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

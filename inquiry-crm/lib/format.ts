export function formatDateTime(date?: Date | string | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export function formatMoney(amount?: number | null) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(amount);
}

export function statusLabel(status: string) {
  return {
    NEW: "新询盘",
    FOLLOWING: "跟进中",
    QUOTED: "已报价",
    WON: "成交",
    LOST: "丢单",
    ARCHIVED: "归档"
  }[status] ?? status;
}

export function roleLabel(role: string) {
  return { ADMIN: "IT 管理员", BOSS: "老板", SALES: "业务员" }[role] ?? role;
}

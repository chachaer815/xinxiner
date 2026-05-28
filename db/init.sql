-- ============================================================
-- 报价查询系统 — 数据库初始化脚本
-- Supabase 项目: eqtyjqvixqcfuumwlfqw
-- 
-- 用途：
--   1. 记录完整的数据库 schema
--   2. 显式授权 Data API 访问（应对 Supabase 安全政策收紧）
--   3. 新建表时的参考模板
--
-- ⚠️  Supabase 安全政策提醒：
--   2026年10月30日起，新建表不会自动暴露给 Data API，
--   必须手动执行 GRANT 语句。此脚本已包含所有表的授权。
--   新增表后请在此文件末尾追加对应的 GRANT 并重新执行！
-- ============================================================

-- ============================================================
-- 1. Schema 授权
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- ============================================================
-- 2. 报价数据表
-- ============================================================
-- quotes: 12.6万条报价记录
--   访问: 查询端通过 Edge Function (service_role) 访问
GRANT SELECT ON public.quotes TO anon, authenticated;

-- ============================================================
-- 3. 产品信息表
-- ============================================================
-- product_info: 产品型号、品名、尺寸、重量
--   访问: 产品搜索通过 Edge Function (service_role) 访问
GRANT SELECT ON public.product_info TO anon, authenticated;

-- ============================================================
-- 4. 系统辅助表（只读）
-- ============================================================
-- query_log: 查询日志
GRANT SELECT ON public.query_log TO anon, authenticated;

-- pwd_version: 密码版本管理
GRANT SELECT ON public.pwd_version TO anon, authenticated;

-- ============================================================
-- 5. 新建表示例模板
-- ============================================================
-- 将来新增表时，取消注释并修改：
--
-- CREATE TABLE public.new_table (
--   id BIGSERIAL PRIMARY KEY,
--   ...你的字段...
--   created_at TIMESTAMPTZ DEFAULT now()
-- );
--
-- -- ⚠️ 必须执行下面两行，否则 Data API 无法访问！
-- ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.new_table TO anon, authenticated;

-- ============================================================
-- 6. 一次性修复：如果现有表权限丢失，执行下面补授权
-- ============================================================
-- 正常情况下无需执行，仅用于应急修复：
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;

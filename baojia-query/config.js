// 报价查询系统 - Supabase 配置
const CONFIG = {
  SUPABASE_URL: 'https://eqtyjqvixqcfuumwlfqw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxdHlqcXZpeHFjZnV1bXdsZnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjE5NDIsImV4cCI6MjA5Mzg5Nzk0Mn0.BnPbpHN_9522gCY8vxJ-7nU1O111HeUM4X6_gxMGWvU',
  
  get API_URL() {
    return this.SUPABASE_URL + '/functions/v1/query';
  },
  get API_PROXY_URL() {
    return this.SUPABASE_URL + '/functions/v1/proxy_ai';
  },
  get API_IMPORT_URL() {
    return this.SUPABASE_URL + '/functions/v1/import_batch';
  }
};

#!/usr/bin/env bash
set -euo pipefail

repo_name="${1:-}"
visibility="${2:-private}"

if [[ -z "$repo_name" ]]; then
  echo "用法: ./scripts/create-github-repo.sh <repo-name> [private|public]" >&2
  exit 1
fi

if [[ "$visibility" != "private" && "$visibility" != "public" ]]; then
  echo "visibility 只能是 private 或 public" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "未找到 GitHub CLI: gh。请先安装 gh 并运行 gh auth login。" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI 尚未登录。请先运行: gh auth login" >&2
  exit 1
fi

if [[ ! -f package.json || ! -d app || ! -d prisma ]]; then
  echo "请在 inquiry-crm 目录内运行本脚本。" >&2
  exit 1
fi

if [[ ! -d .git ]]; then
  git init
fi

git add .
if git diff --cached --quiet; then
  echo "没有新的文件需要提交。"
else
  git commit -m "Initial CRM app"
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "已存在 origin: $(git remote get-url origin)"
else
  if [[ "$visibility" == "private" ]]; then
    gh repo create "$repo_name" --private --source=. --remote=origin --push
  else
    gh repo create "$repo_name" --public --source=. --remote=origin --push
  fi
fi

branch_name="$(git branch --show-current)"
if [[ "$branch_name" != "main" ]]; then
  git branch -M main
fi

git push -u origin main

echo "完成：CRM 已推送到 GitHub 仓库 $repo_name。"

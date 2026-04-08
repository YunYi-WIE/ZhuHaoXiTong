#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
for d in zuhaowaibao admin-ui ZhuHaoXiTong; do
  if [[ ! -d "$REPO_ROOT/$d" ]]; then
    echo "未找到 $REPO_ROOT/$d ，请保持三仓库平级。"
    exit 1
  fi
done

export BUILDKIT_PROGRESS=plain
docker compose -f docker-compose.all-in-one.yml up -d --build

echo ""
echo "默认 root 密码与后端写死配置一致：ZuhooDeploy123（改密请看 compose 与 application-fixed.yml）。"
echo "首次启动请等待 MySQL 导入（约 1～2 分钟），再访问："
echo "  C端  http://127.0.0.1:3002"
echo "  后台 http://127.0.0.1:3003"
echo "  API  http://127.0.0.1:3001"

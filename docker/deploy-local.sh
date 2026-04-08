#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
for d in zuhaowaibao admin-ui ZhuHaoXiTong; do
  if [[ ! -d "$REPO_ROOT/$d" ]]; then
    echo "未找到目录: $REPO_ROOT/$d"
    echo "请保持三个仓库平级放在同一父目录下，例如："
    echo "  .../800/zuhaowaibao"
    echo "  .../800/admin-ui"
    echo "  .../800/ZhuHaoXiTong"
    exit 1
  fi
done

if ! command -v docker >/dev/null 2>&1; then
  echo "请先安装 Docker Desktop（Mac）并确保 docker 命令可用"
  exit 1
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "已创建 docker/.env ，请编辑 MYSQL_* / REDIS_* 后再运行："
  echo "  $0"
  exit 1
fi

export BUILDKIT_PROGRESS=plain
docker compose -f docker-compose.yml --env-file .env build
docker compose -f docker-compose.yml --env-file .env up -d
docker compose -f docker-compose.yml --env-file .env ps

set -a
# shellcheck source=/dev/null
source .env
set +a

echo ""
echo "本机访问："
echo "  C 端 H5   http://127.0.0.1:${H5_PORT:-8080}"
echo "  管理后台   http://127.0.0.1:${ADMIN_PORT:-8081}"
echo "  API 直连  http://127.0.0.1:${API_PORT:-26080}"
echo ""
echo "MySQL / Redis 需在 .env 中指向可访问地址；Mac 连本机常用 host.docker.internal"

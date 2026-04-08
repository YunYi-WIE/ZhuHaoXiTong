#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ ! -f .env ]]; then
  echo "缺少 docker/.env ，请先复制 .env.example 并配置"
  exit 1
fi

# shellcheck source=/dev/null
set -a
source .env
set +a

REGISTRY="${REGISTRY:-}"
if [[ -z "$REGISTRY" ]]; then
  echo "请在 docker/.env 中设置 REGISTRY=你的仓库前缀，或执行："
  echo "  REGISTRY=registry.cn-hangzhou.aliyuncs.com/你的命名空间 bash push-images.sh"
  exit 1
fi

TAG="${IMAGE_TAG:-latest}"
export BUILDKIT_PROGRESS=plain

docker compose -f docker-compose.yml --env-file .env build

for name in api h5 admin; do
  src="zuhoo/${name}:${TAG}"
  dst="${REGISTRY}/zuhoo-${name}:${TAG}"
  docker tag "$src" "$dst"
  docker push "$dst"
  echo "已推送 $dst"
done

echo "完成。服务器上拉取后需用相同环境变量运行容器（或编写服务端 compose 仅使用 image: 不写 build）。"

#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/lv-zhu-blog/current"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF_SRC="$(cd "$SCRIPT_DIR/.." && pwd)/nginx/lv-zhu-blog.conf"
CONF_DST="/etc/nginx/conf.d/lv-zhu-blog.conf"

if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

if ! command -v nginx >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    $SUDO apt-get update
    $SUDO apt-get install -y nginx
  elif command -v dnf >/dev/null 2>&1; then
    $SUDO dnf install -y nginx
  elif command -v yum >/dev/null 2>&1; then
    $SUDO yum install -y nginx
  else
    echo "未找到 apt-get/dnf/yum，无法自动安装 Nginx。请先手动安装 Nginx 后重试。" >&2
    exit 1
  fi
fi

$SUDO mkdir -p "$APP_DIR"

if [ ! -f "$APP_DIR/index.html" ]; then
  printf '%s\n' '<!doctype html><meta charset="utf-8"><title>lv-zhu-blog</title><p>Waiting for deployment.</p>' | $SUDO tee "$APP_DIR/index.html" >/dev/null
fi

$SUDO cp "$CONF_SRC" "$CONF_DST"

if command -v firewall-cmd >/dev/null 2>&1 && $SUDO firewall-cmd --state >/dev/null 2>&1; then
  $SUDO firewall-cmd --permanent --add-service=http
  $SUDO firewall-cmd --permanent --add-service=https
  $SUDO firewall-cmd --permanent --add-port=8080/tcp
  $SUDO firewall-cmd --reload
fi

if command -v ufw >/dev/null 2>&1 && $SUDO ufw status | grep -qi "Status: active"; then
  $SUDO ufw allow 80/tcp
  $SUDO ufw allow 443/tcp
  $SUDO ufw allow 8080/tcp
fi

$SUDO nginx -t

if command -v systemctl >/dev/null 2>&1; then
  $SUDO systemctl enable --now nginx
  $SUDO systemctl reload nginx
else
  $SUDO service nginx reload
fi

echo "Nginx 已配置完成："
echo "  http://lv-zhu.top"
echo "  http://www.lv-zhu.top"
echo "  http://47.97.56.180:8080"

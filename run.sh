#!/usr/bin/env bash
# Startar provet lokalt med Claude-rättning och öppnar det i webbläsaren.
# Kör:  ./run.sh        Avsluta med Ctrl+C.
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-8080}"
URL="http://localhost:$PORT"

command -v node >/dev/null || { echo "Node.js saknas. Installera det från https://nodejs.org"; exit 1; }
command -v claude >/dev/null || echo "Varning: kommandot 'claude' hittades inte – provet rättas då med nyckelord i stället."

# Kör servern redan? Öppna bara provet.
if curl -fs "$URL/api/status" >/dev/null 2>&1; then
  echo "Provet körs redan – öppnar $URL"
  open "$URL"
  exit 0
fi

PORT="$PORT" node lokal/server.mjs &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT INT TERM

for _ in $(seq 1 50); do
  curl -fs "$URL/api/status" >/dev/null 2>&1 && break
  sleep 0.1
done
open "$URL"
wait $SERVER

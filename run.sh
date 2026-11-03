#!/usr/bin/env bash
# Startar provet lokalt med Claude-rättning och öppnar det i webbläsaren.
#   ./run.sh         starta provet (servern fortsätter köra i bakgrunden, även om terminalen stängs)
#   ./run.sh stopp   stoppa provservern
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-8080}"
URL="http://localhost:$PORT"
LOGG="lokal/server.log"

igang() { curl -fs "$URL/api/status" >/dev/null 2>&1; }

if [[ "${1:-}" == "stopp" || "${1:-}" == "stop" ]]; then
  if pkill -f "node lokal/server.mjs"; then echo "Provservern är stoppad."; else echo "Provservern var inte igång."; fi
  exit 0
fi

command -v node >/dev/null || { echo "Node.js saknas. Installera det från https://nodejs.org"; exit 1; }
command -v claude >/dev/null || echo "Varning: kommandot 'claude' hittades inte – provet rättas då med nyckelord i stället."

if igang; then
  echo "Provservern körs redan – öppnar $URL"
else
  PORT="$PORT" nohup node lokal/server.mjs >>"$LOGG" 2>&1 &
  disown
  for _ in $(seq 1 50); do igang && break; sleep 0.1; done
  igang || { echo "Provservern startade inte. Se $LOGG"; exit 1; }
  echo "Provservern körs i bakgrunden på $URL"
fi

echo "Den fortsätter köra tills du skriver:  ./run.sh stopp"
echo "Logg: prov/$LOGG"
open "$URL"

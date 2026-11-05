#!/usr/bin/env bash
# Skickar sistaprov till VPS:en och startar om rättningsservern.  Kör från mappen sistaprov:  server/drift/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
VPS="${VPS:-root@49.12.204.84}"
SSH=(ssh -i ~/.ssh/cp-sirius-04extra -o BatchMode=yes "$VPS")
rsync -az --delete --exclude node_modules --exclude svar --exclude drift -e "ssh -i ~/.ssh/cp-sirius-04extra" \
  index.html fragor.js server "$VPS:/opt/sistaprov/app/"
"${SSH[@]}" 'cd /opt/sistaprov/app/server && PATH=/opt/sistaprov/node/bin:$PATH npm ci --omit=dev --silent \
  && chown -R root:sistaprov /opt/sistaprov/app && chmod -R g+rX,o-rwx /opt/sistaprov/app \
  && systemctl restart sistaprov && sleep 1 && systemctl is-active sistaprov && curl -fs 127.0.0.1:8791/status'
echo

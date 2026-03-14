#!/usr/bin/env bash
set -euo pipefail

FUNCTIONS=(
  drug-interaction-check
  claims-submission
  notification-dispatch
  edi-order
  ehr-sync
  ai-mtm-analysis
  inventory-reorder-check
  expiry-alert-job
  refill-reminder-job
  compliance-report-job
)

for fn in "${FUNCTIONS[@]}"; do
  echo "Deploying function: $fn"
  npx supabase functions deploy "$fn"
done

echo "All edge functions deployed."

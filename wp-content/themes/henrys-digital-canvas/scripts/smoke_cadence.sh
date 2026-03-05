#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
OPS_DIR="${THEME_DIR}/ops"
RUN_LABEL="${RUN_LABEL:-manual}"
STAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
LOG_FILE="${OPS_DIR}/smoke-history.log"
OUT_FILE="${OPS_DIR}/smoke-${STAMP}.log"

mkdir -p "${OPS_DIR}"

printf "Smoke cadence run (%s) at %s\n" "${RUN_LABEL}" "${STAMP}"

set +e
(
	cd "${THEME_DIR}"
	npm run smoke:full
) | tee "${OUT_FILE}"
STATUS=${PIPESTATUS[0]}
set -e

printf "%s\t%s\tstatus=%s\tlog=%s\n" "${STAMP}" "${RUN_LABEL}" "${STATUS}" "$(basename "${OUT_FILE}")" >> "${LOG_FILE}"

if [[ ${STATUS} -ne 0 ]]; then
	printf "Smoke cadence run failed. See %s\n" "${OUT_FILE}" >&2
	exit ${STATUS}
fi

printf "Smoke cadence run passed. Logged in %s\n" "${LOG_FILE}"

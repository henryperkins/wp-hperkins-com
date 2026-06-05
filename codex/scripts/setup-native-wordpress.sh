#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WP_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
THEME_DIR="${WP_ROOT}/wp-content/themes/henrys-digital-canvas"

WP_LOCAL_URL="${WP_LOCAL_URL:-http://localhost:8890}"
WP_DB_NAME="${WP_DB_NAME:-wp_hperkins_com_local}"
WP_DB_USER="${WP_DB_USER:-wp_hperkins_local}"
WP_DB_PASSWORD="${WP_DB_PASSWORD:-wp_hperkins_local}"
WP_DB_HOST="${WP_DB_HOST:-127.0.0.1}"
WP_ADMIN_USER="${WP_ADMIN_USER:-admin}"
WP_ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-admin}"
WP_ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@example.test}"
WP_SITE_TITLE="${WP_SITE_TITLE:-Henry Digital Canvas Local}"

MYSQL_CLIENT="${MYSQL_CLIENT:-}"
MYSQL_ROOT_MODE=""

# WP-CLI 2.12 emits its own deprecation notices on PHP 8.5; keep command
# output parseable while preserving regular errors.
export WP_CLI_PHP_ARGS="${WP_CLI_PHP_ARGS:--d error_reporting=6143}"

log() {
	printf "%s\n" "$*"
}

fail() {
	printf "ERROR: %s\n" "$*" >&2
	exit 1
}

require_command() {
	if ! command -v "$1" >/dev/null 2>&1; then
		fail "Required command not found: $1"
	fi
}

validate_sql_identifier() {
	local value="$1"
	local label="$2"

	if [[ ! "${value}" =~ ^[A-Za-z0-9_]+$ ]]; then
		fail "${label} must contain only letters, numbers, and underscores: ${value}"
	fi
}

sql_string() {
	printf "%s" "$1" | sed "s/\\\\/\\\\\\\\/g; s/'/''/g"
}

run_wp() {
	wp --path="${WP_ROOT}" "$@"
}

select_mysql_client() {
	if [[ -n "${MYSQL_CLIENT}" ]]; then
		require_command "${MYSQL_CLIENT}"
		return
	fi

	if command -v mariadb >/dev/null 2>&1; then
		MYSQL_CLIENT="mariadb"
	elif command -v mysql >/dev/null 2>&1; then
		MYSQL_CLIENT="mysql"
	else
		fail "Neither mariadb nor mysql client is installed."
	fi
}

discover_root_mysql() {
	if "${MYSQL_CLIENT}" --protocol=socket -uroot -e "SELECT 1" >/dev/null 2>&1; then
		MYSQL_ROOT_MODE="direct"
		return 0
	fi

	if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
		if sudo -n "${MYSQL_CLIENT}" --protocol=socket -uroot -e "SELECT 1" >/dev/null 2>&1; then
			MYSQL_ROOT_MODE="sudo"
			return 0
		fi
	fi

	return 1
}

run_root_mysql() {
	case "${MYSQL_ROOT_MODE}" in
		direct)
			"${MYSQL_CLIENT}" --protocol=socket -uroot "$@"
			;;
		sudo)
			sudo -n "${MYSQL_CLIENT}" --protocol=socket -uroot "$@"
			;;
		*)
			fail "Root MariaDB/MySQL mode has not been initialized."
			;;
	esac
}

service_exists() {
	local service="$1"

	systemctl list-unit-files "${service}.service" >/dev/null 2>&1
}

try_start_database_service() {
	if discover_root_mysql; then
		return
	fi

	if ! command -v systemctl >/dev/null 2>&1; then
		fail "MariaDB/MySQL is not reachable, and systemctl is unavailable to start it."
	fi

	for service in mariadb mysql; do
		if service_exists "${service}"; then
			log "Starting ${service}.service..."
			if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
				sudo -n systemctl start "${service}" || true
				sleep 2
				if discover_root_mysql; then
					return
				fi
			fi
		fi
	done

	fail "MariaDB/MySQL is not reachable. Start it with 'sudo systemctl start mariadb' and rerun setup."
}

create_database() {
	local db_name_escaped db_user_escaped db_password_escaped

	validate_sql_identifier "${WP_DB_NAME}" "WP_DB_NAME"
	validate_sql_identifier "${WP_DB_USER}" "WP_DB_USER"

	db_name_escaped="${WP_DB_NAME}"
	db_user_escaped="$(sql_string "${WP_DB_USER}")"
	db_password_escaped="$(sql_string "${WP_DB_PASSWORD}")"

	log "Ensuring local database and user exist..."
	run_root_mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`${db_name_escaped}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${db_user_escaped}'@'localhost' IDENTIFIED BY '${db_password_escaped}';
CREATE USER IF NOT EXISTS '${db_user_escaped}'@'127.0.0.1' IDENTIFIED BY '${db_password_escaped}';
ALTER USER '${db_user_escaped}'@'localhost' IDENTIFIED BY '${db_password_escaped}';
ALTER USER '${db_user_escaped}'@'127.0.0.1' IDENTIFIED BY '${db_password_escaped}';
GRANT ALL PRIVILEGES ON \`${db_name_escaped}\`.* TO '${db_user_escaped}'@'localhost';
GRANT ALL PRIVILEGES ON \`${db_name_escaped}\`.* TO '${db_user_escaped}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

	MYSQL_PWD="${WP_DB_PASSWORD}" "${MYSQL_CLIENT}" \
		-h "${WP_DB_HOST}" \
		-u "${WP_DB_USER}" \
		"${WP_DB_NAME}" \
		-e "SELECT 1" >/dev/null
}

download_wordpress_core() {
	if [[ -f "${WP_ROOT}/wp-settings.php" && -d "${WP_ROOT}/wp-admin" && -d "${WP_ROOT}/wp-includes" ]]; then
		log "WordPress core already present."
		return
	fi

	log "Downloading WordPress core..."
	run_wp core download --skip-content
}

create_wp_config() {
	if [[ -f "${WP_ROOT}/wp-config.php" ]]; then
		log "wp-config.php already exists."
		return
	fi

	log "Creating wp-config.php..."
	run_wp config create \
		--dbname="${WP_DB_NAME}" \
		--dbuser="${WP_DB_USER}" \
		--dbpass="${WP_DB_PASSWORD}" \
		--dbhost="${WP_DB_HOST}" \
		--skip-check \
		--extra-php <<'PHP'
define( 'WP_ENVIRONMENT_TYPE', 'local' );
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
define( 'SCRIPT_DEBUG', true );
if ( ! defined( 'FS_METHOD' ) ) {
	define( 'FS_METHOD', 'direct' );
}
PHP
}

install_wordpress() {
	if run_wp core is-installed >/dev/null 2>&1; then
		log "WordPress database already installed."
	else
		log "Installing WordPress database..."
		run_wp core install \
			--url="${WP_LOCAL_URL}" \
			--title="${WP_SITE_TITLE}" \
			--admin_user="${WP_ADMIN_USER}" \
			--admin_password="${WP_ADMIN_PASSWORD}" \
			--admin_email="${WP_ADMIN_EMAIL}" \
			--skip-email
	fi

	run_wp option update home "${WP_LOCAL_URL}" >/dev/null
	run_wp option update siteurl "${WP_LOCAL_URL}" >/dev/null
	run_wp option update permalink_structure '/%postname%/' >/dev/null
}

install_and_activate_theme() {
	if ! run_wp theme is-installed twentytwentyfive >/dev/null 2>&1; then
		log "Installing twentytwentyfive parent theme..."
		run_wp theme install twentytwentyfive
	fi

	log "Activating henrys-digital-canvas..."
	run_wp theme activate henrys-digital-canvas
}

activate_safe_plugins() {
	if run_wp plugin is-installed hdc-ai-media-modal >/dev/null 2>&1; then
		log "Activating hdc-ai-media-modal..."
		run_wp plugin activate hdc-ai-media-modal || log "hdc-ai-media-modal could not be activated; continuing."
	fi

	if run_wp plugin is-installed gutenberg >/dev/null 2>&1; then
		log "Activating existing Gutenberg plugin..."
		run_wp plugin activate gutenberg || log "Gutenberg could not be activated; continuing."
	else
		log "Installing Gutenberg plugin when compatible..."
		run_wp plugin install gutenberg --activate || log "Gutenberg install/activation skipped; continuing with core block editor."
	fi
}

install_theme_dependencies() {
	if [[ ! -f "${THEME_DIR}/package.json" ]]; then
		return
	fi

	if [[ -d "${THEME_DIR}/node_modules" ]]; then
		log "Theme node_modules already present."
		return
	fi

	require_command npm
	log "Installing theme npm dependencies..."
	(
		cd "${THEME_DIR}"
		npm install
	)
}

sync_pages_and_rewrites() {
	log "Syncing route-owned page records..."
	(
		cd "${THEME_DIR}"
		WP_ROOT="${WP_ROOT}" npm run sync:pages
	)

	log "Flushing rewrite rules..."
	run_wp rewrite flush
}

main() {
	require_command wp
	require_command php
	select_mysql_client
	try_start_database_service
	create_database
	download_wordpress_core
	create_wp_config
	install_wordpress
	install_and_activate_theme
	activate_safe_plugins
	install_theme_dependencies
	sync_pages_and_rewrites

	log ""
	log "Native WordPress setup complete."
	log "URL: ${WP_LOCAL_URL}"
	log "Admin user: ${WP_ADMIN_USER}"
	log "Admin password: ${WP_ADMIN_PASSWORD}"
	log "Start server: codex/scripts/start-native-wordpress.sh"
}

main "$@"

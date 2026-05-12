# Native WordPress Install

This repo can run as a native WordPress installation without Docker. WordPress core and local runtime files are downloaded into the repo root and ignored by git; site-owned code remains tracked under `wp-content/`.

## Setup

Run:

```bash
codex/scripts/setup-native-wordpress.sh
```

The setup script uses these local defaults:

- URL: `http://localhost:8890`
- Database: `wp_hperkins_com_local`
- Database user: `wp_hperkins_local`
- Database password: `wp_hperkins_local`
- Admin user: `admin`
- Admin password: `admin`
- Admin email: `admin@example.test`

These admin defaults are for local-only installs. Rotate the password before exposing the site on a public hostname.

Override defaults by exporting `WP_LOCAL_URL`, `WP_DB_NAME`, `WP_DB_USER`, `WP_DB_PASSWORD`, `WP_DB_HOST`, `WP_ADMIN_USER`, `WP_ADMIN_PASSWORD`, or `WP_ADMIN_EMAIL`.

## Start

Run:

```bash
codex/scripts/start-native-wordpress.sh
```

Open `http://localhost:8890`.

## Public Nginx and HTTPS

The repo includes a starter Nginx server block at `codex/nginx/wp-hperkins-com.conf`. The installed server uses Nginx, PHP-FPM, MariaDB, and Certbot directly on the host; it does not use Docker.

Install the Nginx site config:

```bash
sudo cp codex/nginx/wp-hperkins-com.conf /etc/nginx/sites-available/wp-hperkins-com
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/wp-hperkins-com /etc/nginx/sites-enabled/wp-hperkins-com
sudo nginx -t
sudo systemctl reload nginx
```

If the repo lives under `/home/dev`, allow the web server to traverse the repo and write uploads:

```bash
mkdir -p wp-content/uploads wp-content/upgrade
sudo setfacl -m u:www-data:rx /home/dev
sudo setfacl -R -m u:www-data:rX /home/dev/wp-hperkins-com
sudo setfacl -R -m u:www-data:rwx /home/dev/wp-hperkins-com/wp-content/uploads /home/dev/wp-hperkins-com/wp-content/upgrade
```

Allow dashboard plugin installs, plugin updates, and language packs without making WordPress core writable:

```bash
mkdir -p wp-content/plugins wp-content/upgrade wp-content/languages/plugins wp-content/languages/themes
sudo setfacl -R -m u:www-data:rwx wp-content/plugins wp-content/upgrade wp-content/languages
sudo find wp-content/plugins wp-content/upgrade wp-content/languages -type d -exec setfacl -m d:u:www-data:rwx {} +
```

Point WordPress at the public hostname:

```bash
wp --path=/home/dev/wp-hperkins-com option update home 'http://wp.hperkins.com'
wp --path=/home/dev/wp-hperkins-com option update siteurl 'http://wp.hperkins.com'
wp --path=/home/dev/wp-hperkins-com rewrite flush
```

Issue and install the Let's Encrypt certificate:

```bash
sudo certbot --nginx -d wp.hperkins.com --redirect --agree-tos --register-unsafely-without-email --non-interactive
```

After Certbot enables HTTPS, update the canonical WordPress URLs:

```bash
wp --path=/home/dev/wp-hperkins-com option update home 'https://wp.hperkins.com'
wp --path=/home/dev/wp-hperkins-com option update siteurl 'https://wp.hperkins.com'
wp --path=/home/dev/wp-hperkins-com rewrite flush
```

## Core Updates

On the public host, keep WordPress core writable by the shell user instead of `www-data`. This means admin UI core updates can fail with copy errors, but the web server does not need broad write access to `wp-admin`, `wp-includes`, or root WordPress files.

Run public core updates through WP-CLI:

```bash
backup_dir="/home/dev/.wp-hperkins-com-backups/manual-core-update-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup_dir"
chmod 700 /home/dev/.wp-hperkins-com-backups
wp --path=/home/dev/wp-hperkins-com db export "$backup_dir/pre-core-update.sql"
wp --path=/home/dev/wp-hperkins-com core update --version=nightly --force
wp --path=/home/dev/wp-hperkins-com core update-db
wp --path=/home/dev/wp-hperkins-com core version
mkdir -p /home/dev/wp-hperkins-com/wp-content/upgrade
sudo setfacl -R -m u:www-data:rwx /home/dev/wp-hperkins-com/wp-content/upgrade
sudo find /home/dev/wp-hperkins-com/wp-content/upgrade -type d -exec setfacl -m d:u:www-data:rwx {} +
```

## Verify

With the local server running, run:

```bash
codex/scripts/verify-native-wordpress.sh
```

The verifier checks the WordPress install, active theme, page records, REST API, and the theme route/API smoke scripts.

## Reset

To reset local WordPress runtime files, stop the server and remove ignored WordPress files:

```bash
rm -rf wp-admin wp-includes
rm -f index.php license.txt readme.html wp-*.php xmlrpc.php .htaccess
rm -f wp-config.php
```

To reset the local database:

```bash
mariadb -uroot -e "DROP DATABASE IF EXISTS wp_hperkins_com_local;"
```

Then rerun setup.

## Troubleshooting

If MariaDB is installed but inactive, start it and rerun setup:

```bash
sudo systemctl start mariadb
```

If port `8890` is already in use:

```bash
WP_LOCAL_PORT=8891 WP_LOCAL_URL=http://localhost:8891 codex/scripts/start-native-wordpress.sh
```

If the theme page records drift:

```bash
cd wp-content/themes/henrys-digital-canvas
WP_ROOT=/home/dev/wp-hperkins-com npm run sync:pages
```

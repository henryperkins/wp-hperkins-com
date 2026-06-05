# WordPress Production Runbook

## Runtime

- WordPress root: `/home/ubuntu/wp-hperkins-com`
- Current HTTP URL: `http://209.97.147.66`
- Target HTTPS URL: `https://wp.hperkins.com`
- Web server: Nginx, config at `/etc/nginx/sites-available/wp-hperkins-com`
- PHP runtime: PHP-FPM 8.5, socket at `/run/php/php8.5-fpm.sock`
- Database: MariaDB, database `wp_hperkins_com`
- WP-CLI: `wp --path=/home/ubuntu/wp-hperkins-com <command>`

`wp.hperkins.com` must point to `209.97.147.66` before issuing TLS or switching the WordPress URL to the domain.

## Service Commands

```bash
sudo systemctl status nginx php8.5-fpm mariadb
sudo systemctl reload nginx
sudo systemctl restart php8.5-fpm
wp --path=/home/ubuntu/wp-hperkins-com cache flush
wp --path=/home/ubuntu/wp-hperkins-com rewrite flush
```

## Backups

Daily backups run from `/etc/cron.d/wp-hperkins-com` via `/usr/local/sbin/wp-hperkins-com-backup`.

- Backup directory: `/var/backups/wp-hperkins-com`
- Retention: 14 days
- Contents: database export plus `wp-config.php`, `.htaccess`, and `wp-content`
- Excluded: cache, upgrade scratch files, theme `node_modules`, git metadata

Run a manual backup:

```bash
sudo -u ubuntu /usr/local/sbin/wp-hperkins-com-backup
```

## DNS and TLS Cutover

After DNS for `wp.hperkins.com` resolves to `209.97.147.66`:

```bash
sudo certbot --nginx -d wp.hperkins.com
wp --path=/home/ubuntu/wp-hperkins-com option update home 'https://wp.hperkins.com'
wp --path=/home/ubuntu/wp-hperkins-com option update siteurl 'https://wp.hperkins.com'
wp --path=/home/ubuntu/wp-hperkins-com rewrite flush
wp --path=/home/ubuntu/wp-hperkins-com cache flush
```

Then verify:

```bash
cd /home/ubuntu/wp-hperkins-com/wp-content/themes/henrys-digital-canvas
BASE_URL=https://wp.hperkins.com npm run smoke:full
```

## Known Gaps

- SMTP/sendmail is not configured. Password rotation surfaced the expected `sendmail` warning, so production email should be wired to an SMTP provider before relying on WordPress email delivery.
- The public `ai` plugin requires WordPress 7.0, so it is intentionally not active on the stable 6.9.x install.
- Service-backed plugins such as Jetpack, Site Kit, MailPoet, Redis object cache, MCP adapter, and AI providers still need credentials or infrastructure before activation.

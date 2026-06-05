---
name: cache-flush
description: Flush all WordPress caches (object cache, page cache, rewrite rules). Use after theme changes, plugin updates, or deployment.
disable-model-invocation: true
---

## Cache Flush

Clears all WordPress cache layers in the correct order.

### Steps

1. **Flush object cache**
   ```bash
   wp --path=/home/ubuntu/wp-hperkins-com cache flush
   ```

2. **Flush rewrite rules**
   ```bash
   wp --path=/home/ubuntu/wp-hperkins-com rewrite flush
   ```

3. **Purge page cache**
   Cache Enabler does not have a WP-CLI command. Inform the user:
   > Page cache (Cache Enabler) must be purged from the WordPress admin:
   > Settings > Cache Enabler > Clear Cache, or use the admin bar "Clear Cache" button.
   >
   > Direct link: https://wp.hperkins.com/wp-admin/options-general.php?page=cache-enabler

4. **Confirm**
   ```bash
   wp --path=/home/ubuntu/wp-hperkins-com cache type
   ```
   Report which object cache backend is active.

### When to use

- After changing rewrite rules (new routes, slug changes)
- After theme or plugin updates
- After modifying `theme.json` or `design-system.css`
- After deploying block changes to production
- When seeing stale content on the live site

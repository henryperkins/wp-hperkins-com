---
name: cache-flush
description: Flush WordPress caches (object cache, rewrite rules). Use after theme changes, plugin updates, or deployment.
disable-model-invocation: true
---

## Cache Flush

Clears all WordPress cache layers in the correct order.

**No page-cache plugin is installed** (cache-enabler was removed) — the object cache flush below is sufficient. Do not look for a page cache to purge.

### Steps

1. **Flush object cache**
   ```bash
   wp --path=/home/dev/wp-hperkins-com cache flush
   ```

2. **Flush rewrite rules** (only needed after rewrite/route changes)
   ```bash
   wp --path=/home/dev/wp-hperkins-com rewrite flush
   ```

3. **Confirm**
   ```bash
   wp --path=/home/dev/wp-hperkins-com cache type
   ```
   Report which object cache backend is active.

### When to use

- After changing rewrite rules (new routes, slug changes)
- After theme or plugin updates
- After modifying `theme.json` or `design-system.css`
- After deploying block changes to production
- When seeing stale content on the live site

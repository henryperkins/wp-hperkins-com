<?php
/**
 * Home Core bootstrap — loads the synced hdc_repo CPT + Selected Work tree.
 *
 * Pure (WP-free) logic lives in repo-logic.php. Further requires are added by
 * later tasks as each file is created, so every commit stays loadable.
 *
 * @package henrys-digital-canvas
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/repo-logic.php';
require_once __DIR__ . '/repo-cpt.php';
require_once __DIR__ . '/markup.php';
require_once __DIR__ . '/patterns.php';
require_once __DIR__ . '/query-loop.php';
require_once __DIR__ . '/styles.php';
require_once __DIR__ . '/block-styles.php';
require_once __DIR__ . '/home-patterns.php';
require_once __DIR__ . '/post-reading-time.php';
require_once __DIR__ . '/seed.php';
require_once __DIR__ . '/sync.php';

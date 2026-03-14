/**
 * Invalidates core-data entity records for uploaded attachments so that
 * blocks re-fetch updated data (e.g. `media_details.sizes` after
 * thumbnails have been generated via client-side media processing).
 *
 * @param {Object[]} attachments Array of attachment objects from the upload queue.
 */
export default function mediaUploadOnSuccess(attachments: Object[]): void;
//# sourceMappingURL=on-success.d.ts.map
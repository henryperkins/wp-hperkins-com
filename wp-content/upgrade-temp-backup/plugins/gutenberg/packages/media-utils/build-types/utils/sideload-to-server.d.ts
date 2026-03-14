/**
 * Internal dependencies
 */
import type { CreateSideloadFile, RestAttachment } from './types';
/**
 * Uploads a file to the server without creating an attachment.
 *
 * @param file           Media File to Save.
 * @param attachmentId   Parent attachment ID.
 * @param additionalData Additional data to include in the request.
 * @param signal         Abort signal.
 *
 * @return The saved attachment.
 */
export declare function sideloadToServer(file: File, attachmentId: RestAttachment['id'], additionalData?: CreateSideloadFile, signal?: AbortSignal): Promise<import("./types").Attachment>;
//# sourceMappingURL=sideload-to-server.d.ts.map
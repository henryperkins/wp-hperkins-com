/**
 * Internal dependencies
 */
import type { OnChangeHandler, OnErrorHandler, CreateSideloadFile, RestAttachment } from './types';
interface SideloadMediaArgs {
    additionalData?: CreateSideloadFile;
    file: File;
    attachmentId: RestAttachment['id'];
    onError?: OnErrorHandler;
    onFileChange?: OnChangeHandler;
    signal?: AbortSignal;
}
/**
 * Uploads a file to the server without creating an attachment.
 *
 * @param $0                Parameters object passed to the function.
 * @param $0.file           Media File to Save.
 * @param $0.attachmentId   Parent attachment ID.
 * @param $0.additionalData Additional data to include in the request.
 * @param $0.signal         Abort signal.
 * @param $0.onFileChange   Function called each time a file or a temporary representation of the file is available.
 * @param $0.onError        Function called when an error happens.
 */
export declare function sideloadMedia({ file, attachmentId, additionalData, signal, onFileChange, onError, }: SideloadMediaArgs): Promise<void>;
export {};
//# sourceMappingURL=sideload-media.d.ts.map
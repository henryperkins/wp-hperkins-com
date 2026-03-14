import { type CRDTDoc, type SyncConfig, Y } from '@wordpress/sync';
import { type Block, type YBlocks } from './crdt-blocks';
import { type Post } from '../entity-types/post';
import { type Type } from '../entity-types';
import type { WPSelection } from '../types';
import { type YMapRecord, type YMapWrap } from './crdt-utils';
export type PostChanges = Partial<Post> & {
    blocks?: Block[];
    content?: Post['content'] | string;
    excerpt?: Post['excerpt'] | string;
    selection?: WPSelection;
    title?: Post['title'] | string;
};
export interface YPostRecord extends YMapRecord {
    author: number;
    blocks: YBlocks | undefined;
    content: Y.Text;
    categories: number[];
    comment_status: string;
    date: string | null;
    excerpt: Y.Text;
    featured_media: number;
    format: string;
    meta: YMapWrap<YMapRecord>;
    ping_status: string;
    slug: string;
    status: string;
    sticky: boolean;
    tags: number[];
    template: string;
    title: Y.Text;
}
export declare const POST_META_KEY_FOR_CRDT_DOC_PERSISTENCE = "_crdt_document";
/**
 * Given a set of local changes to a post record, apply those changes to the
 * local Y.Doc.
 *
 * @param {CRDTDoc}     ydoc
 * @param {PostChanges} changes
 * @param {Type}        _postType
 * @return {void}
 */
export declare function applyPostChangesToCRDTDoc(ydoc: CRDTDoc, changes: PostChanges, _postType: Type): void;
/**
 * Given a local Y.Doc that *may* contain changes from remote peers, compare
 * against the local record and determine if there are changes (edits) we want
 * to dispatch.
 *
 * @param {CRDTDoc} ydoc
 * @param {Post}    editedRecord
 * @param {Type}    _postType
 * @return {Partial<PostChanges>} The changes that should be applied to the local record.
 */
export declare function getPostChangesFromCRDTDoc(ydoc: CRDTDoc, editedRecord: Post, _postType: Type): PostChanges;
/**
 * This default sync config can be used for entities that are flat maps of
 * primitive values and do not require custom logic to merge changes.
 */
export declare const defaultSyncConfig: SyncConfig;
//# sourceMappingURL=crdt.d.ts.map
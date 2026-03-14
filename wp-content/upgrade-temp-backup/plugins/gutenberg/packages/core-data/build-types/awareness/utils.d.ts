/**
 * Internal dependencies
 */
import type { User } from '../entity-types';
import type { CollaboratorInfo } from './types';
export declare function areMapsEqual<Key, Value>(map1: Map<Key, Value>, map2: Map<Key, Value>, comparatorFn: (value1: Value, value2: Value) => boolean): boolean;
/**
 * Check if two collaborator infos are equal.
 *
 * @param collaboratorInfo1 - The first collaborator info.
 * @param collaboratorInfo2 - The second collaborator info.
 * @return True if the collaborator infos are equal, false otherwise.
 */
export declare function areCollaboratorInfosEqual(collaboratorInfo1?: CollaboratorInfo, collaboratorInfo2?: CollaboratorInfo): boolean;
/**
 * Generate a collaborator info object from a current collaborator.
 *
 * @param currentCollaborator - The current collaborator.
 * @return The collaborator info object.
 */
export declare function generateCollaboratorInfo(currentCollaborator: User<'view'>): CollaboratorInfo;
export declare function getRecordValue<RecordType, Key extends keyof RecordType>(obj: unknown, key: Key): RecordType[Key] | null;
export declare function getTypedKeys<T extends object>(obj: T): Array<keyof T>;
//# sourceMappingURL=utils.d.ts.map
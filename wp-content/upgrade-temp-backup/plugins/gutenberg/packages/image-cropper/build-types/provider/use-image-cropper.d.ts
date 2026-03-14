/**
 * Internal dependencies
 */
import type { ImageCropperState, CropperState } from '../types';
export declare const DEFAULT_INITIAL_STATE: Required<ImageCropperState>;
export default function useCropper(): {
    cropperState: CropperState;
    setCropperState: (newState: Partial<CropperState> | ((prev: CropperState) => Partial<CropperState>)) => void;
    resetState: ImageCropperState | null;
    setResetState: (newResetState?: Partial<ImageCropperState> | null) => void;
    isDirty: boolean;
    reset: () => void;
    getCroppedImage: (src: string) => Promise<string | null>;
};
//# sourceMappingURL=use-image-cropper.d.ts.map
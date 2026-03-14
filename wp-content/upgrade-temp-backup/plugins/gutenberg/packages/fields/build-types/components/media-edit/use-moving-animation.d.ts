/**
 * Hook used to compute the styles required to move a div into a new position.
 *
 * The way this animation works is the following:
 *  - It first renders the element as if there was no animation.
 *  - It takes a snapshot of the position of the element to use it
 *    as a destination point for the animation.
 *  - It restores the element to the previous position using a CSS transform
 *
 * @param triggerAnimationOnChange Variable used to trigger the animation if it changes.
 */
export default function useMovingAnimation(triggerAnimationOnChange: unknown): import("react").RefObject<HTMLDivElement>;
//# sourceMappingURL=use-moving-animation.d.ts.map
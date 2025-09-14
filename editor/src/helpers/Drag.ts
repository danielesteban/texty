export const Drag = (
  onStart: (pointer: { x: number; y: number }) => void,
  onMove: (movement: { x: number; y: number }) => void,
  onEnd?: () => void,
  onSecondary?: (pointer: { x: number; y: number }) => void,
) => {
  const initialPointer = { x: 0, y: 0 };
  const movement = { x: 0, y: 0 };
  const dragMove = (e: PointerEvent) => {
    movement.x = e.clientX - initialPointer.x;
    movement.y = e.clientY - initialPointer.y;
    onMove(movement);
  };
  const dragEnd = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    target.removeEventListener('pointermove', dragMove);
    target.removeEventListener('pointerup', dragEnd);
    target.removeEventListener('pointercancel', dragEnd);
    target.removeEventListener('lostpointercapture', dragEnd);
    target.releasePointerCapture(e.pointerId);
    onEnd && onEnd();
  };
  return (e: PointerEvent) => {
    initialPointer.x = e.clientX;
    initialPointer.y = e.clientY;
    e.stopPropagation();
    if (['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLDivElement).tagName)) {
      return;
    }
    if (e.button !== 0) {
      e.button === 2 && onSecondary && onSecondary(initialPointer);
      return;
    }
    const target = e.currentTarget as HTMLDivElement;
    target.setPointerCapture(e.pointerId);
    target.addEventListener('pointermove', dragMove);
    target.addEventListener('pointerup', dragEnd);
    target.addEventListener('pointercancel', dragEnd);
    target.addEventListener('lostpointercapture', dragEnd);
    onStart(initialPointer);
  };
};

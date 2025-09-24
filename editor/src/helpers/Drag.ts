export const Drag = ({ onStart, onMove, onEnd, onSecondary }: {
  onStart: (pointer: { x: number; y: number }) => void,
  onMove: (pointer: { x: number; y: number }, movement: { x: number; y: number }) => void,
  onEnd?: (pointer: { x: number; y: number }, movement: { x: number; y: number }) => void,
  onSecondary?: (pointer: { x: number; y: number }) => void,
}) => {
  const initialPointer = { x: 0, y: 0 };
  const movement = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  const computeMovement = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    movement.x = pointer.x - initialPointer.x;
    movement.y = pointer.y - initialPointer.y;
  };
  const dragMove = (e: PointerEvent) => {
    computeMovement(e);
    onMove(pointer, movement);
  };
  const dragEnd = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    target.removeEventListener('pointermove', dragMove);
    target.removeEventListener('pointerup', dragEnd);
    target.removeEventListener('pointercancel', dragEnd);
    target.removeEventListener('lostpointercapture', dragEnd);
    target.releasePointerCapture(e.pointerId);
    if (onEnd) {
      computeMovement(e);
      onEnd(pointer, movement);
    }
  };
  return (e: PointerEvent) => {
    initialPointer.x = pointer.x = e.clientX;
    initialPointer.y = pointer.y = e.clientY;
    e.stopPropagation();
    if (
      ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLDivElement).tagName)
      || (e.target as HTMLDivElement).hasAttribute('data-no-drag')
    ) {
      return;
    }
    if (e.button !== 0) {
      e.button === 2 && onSecondary && onSecondary(pointer);
      return;
    }
    const target = e.currentTarget as HTMLDivElement;
    target.setPointerCapture(e.pointerId);
    target.addEventListener('pointermove', dragMove);
    target.addEventListener('pointerup', dragEnd);
    target.addEventListener('pointercancel', dragEnd);
    target.addEventListener('lostpointercapture', dragEnd);
    onStart(pointer);
  };
};

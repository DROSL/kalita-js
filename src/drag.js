function addDragListener(target, innerTarget, listener) {
    const hasPointerEvent = target.onpointerup !== undefined;
    const hasTouchEvent = target.ontouchstart !== undefined;
    const pointerDown = hasPointerEvent ? "pointerdown" : hasTouchEvent ? "touchstart" : "mousedown";
    const pointerMove = hasPointerEvent ? "pointermove" : hasTouchEvent ? "touchmove" : "mousemove";
    const pointerUp = hasPointerEvent ? "pointerup" : hasTouchEvent ? "touchend" : "mouseup";

    let window, start, end;
    target.addEventListener(pointerDown, onPointerDown);

    function onPointerDown(event) {
        window = target.ownerDocument.defaultView;
    
        const rect = innerTarget.getBoundingClientRect();
        start = rect.left;
        end = rect.right;
    
        onPointerMove(event);
    
        window.addEventListener(pointerMove, onPointerMove);
        window.addEventListener(pointerUp, onPointerUp);
    }

    function onPointerMove(event) {
        event.preventDefault();
    
        const position = "clientX" in event ? event.clientX : event.touches && event.touches[0] && event.touches[0].clientX || 0;
        const percentage = (position - start) / (end - start);

        listener(Math.min(Math.max(percentage, 0), 1));
    }

    function onPointerUp() {
        window.removeEventListener(pointerMove, onPointerMove);
        window.removeEventListener(pointerUp, onPointerUp);
    }
}

export default addDragListener;
import {Cursor} from "./types";

export function renderTextAndCursors(text: string, cursors: Cursor[], cursorIdx = 0) {
  if (cursorIdx === cursors.length) {
    return (
      <code>{text.substring(cursors[cursorIdx - 1].pos + 1, text.length)}</code>
    );
  }

  const cursorCurrent = cursors[cursorIdx];
  const cursorPrev = cursors[cursorIdx - 1];

  return (
    <code>
      <code>{renderTextBetweenCursors(cursorPrev, cursorCurrent, text)}</code>
      <span className="qc-cursor-container">
        <span className={`qc-cursor ${cursorCurrent.cursorStyles?.line}`}></span>
        <span className={`qc-cursor-name ${cursorCurrent.cursorStyles?.title}`}>
          {cursorCurrent.name}
        </span>
      </span>
      {renderTextAndCursors(text, cursors, cursorIdx + 1)}
    </code>
  );
}

function renderTextBetweenCursors(cursorPrev: Cursor | null, cursorCurrent: Cursor, text: string) {
  const isPrevCursorDraggedBackward =
    (cursorPrev?.dragStartPosition && cursorPrev?.dragStartPosition > cursorPrev.pos) ?? false;
  const isCurrentCursorDraggedForward =
    (cursorCurrent.dragStartPosition && cursorCurrent.dragStartPosition < cursorCurrent.pos) ??
    false;

  if (isPrevCursorDraggedBackward && !isCurrentCursorDraggedForward) {
    return (
      <code>
        <code className={cursorPrev?.cursorStyles?.selectedText}>
          {cursorPrev?.dragStartPosition &&
            text.substring(cursorPrev?.pos + 1, cursorPrev?.dragStartPosition + 1)}
        </code>
        <code>
          {cursorPrev?.dragStartPosition &&
            text.substring(cursorPrev?.dragStartPosition + 1, cursorCurrent.pos + 1)}
        </code>
      </code>
    );
  }
  if (!isPrevCursorDraggedBackward && isCurrentCursorDraggedForward) {
    return (
      <code>
        <code>
          {cursorCurrent?.dragStartPosition && text.substring((cursorPrev?.pos ?? -1) + 1, cursorCurrent?.dragStartPosition)}
        </code>
        <code className={cursorCurrent?.cursorStyles?.selectedText}>
          {cursorCurrent?.dragStartPosition && text.substring(cursorCurrent?.dragStartPosition, cursorCurrent.pos + 1)}
        </code>
      </code>
    );
  }
  if (isPrevCursorDraggedBackward && isCurrentCursorDraggedForward) {
    return (
      <code>
        <code className={cursorPrev?.cursorStyles?.selectedText}>
          {cursorPrev?.dragStartPosition &&
            text.substring(cursorPrev?.pos + 1, cursorPrev?.dragStartPosition + 1)}
        </code>
        <code>
          {cursorPrev?.dragStartPosition && cursorCurrent?.dragStartPosition && text.substring(cursorPrev?.dragStartPosition + 1, cursorCurrent?.dragStartPosition)}
        </code>
        <code className={cursorCurrent?.cursorStyles?.selectedText}>
          {cursorCurrent?.dragStartPosition && text.substring(cursorCurrent?.dragStartPosition, cursorCurrent.pos + 1)}
        </code>
      </code>
    );
  }
  return <code>{text.substring((cursorPrev?.pos ?? -1) + 1, cursorCurrent.pos + 1)}</code>;
}

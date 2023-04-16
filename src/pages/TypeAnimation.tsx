import { useEffect, useState } from 'react';
import MultiCursor from '../lib/MultiCursor';
import { v4 as uuid } from 'uuid';
import { renderTextAndCursors } from '../lib/MultiCursorRenderer';

const multiCursor = new MultiCursor({ startText: 'Collaborative editor for busy engineers' })
  .addCursor({
    name: 'Sudheer',
    id: 'sudh',
    cursorStyles: {
      title: 'bg-green-500',
      line: 'border-green-500',
      selectedText: 'bg-green-600'
    },
    pos: 15
  })
  .moveCursor('sudh', 3, 'l')
  .addCursor({
    name: 'Roy',
    id: 'roy',
    pos: 29,
    cursorStyles: {
      title: 'bg-blue-500',
      line: 'border-blue-500',
      selectedText: 'bg-blue-600'
    }
  })
  .type('sudh', ' text')
  .cursorDragStart('roy')
  .moveCursor('roy', 8, 'r')
  .backSpace('sudh', 4)
  .type('sudh', ' code')
  .backSpace('roy', 8)
  .type('roy', 'dev');

export const TypeAnimation = () => {
  const [renderId, setRenderId] = useState<string>(uuid());

  useEffect(() => {
    multiCursor.addStateChangeCallBack(() => setRenderId(uuid())).start();
  }, []);

  return (
    <div className={'bg-slate-800 h-40'} id={renderId}>
      <div
        className={'border-4 border-slate-500/30 h-full border-r-4'}
        style={{ background: '#1d1e22' }}
      >
        {renderTextAndCursors(multiCursor.getText(), multiCursor.getCursors())}
      </div>
    </div>
  );
};

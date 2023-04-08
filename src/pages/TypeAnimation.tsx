import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import MultiCursor from '../lib/MultiCursor';
import { v4 as uuid } from 'uuid';
import { renderTextAndCursors } from '../lib/MultiCursorRenderer';

const multiCursor = new MultiCursor({ startText: 'Hello World' })
  .addCursor({
    name: 'Sudheer',
    id: 'sudh',
    cursorStyles: {
      title: 'bg-green-500',
      line: 'border-green-500',
      selectedText: 'bg-green-300'
    },
    pos: 3
  })
  .addCursor({
    name: 'Roy',
    id: 'roy',
    pos: 7,
    cursorStyles: {
      title: 'bg-blue-500',
      line: 'border-blue-500',
      selectedText: 'bg-blue-300'
    },
  })
  .moveCursor('sudh', 3, 'r')
  .moveCursor('roy', 3, 'l')
  .type('sudh', 'abc')
  .type('roy', 'pqr')
  .cursorDragStart('sudh')
  .moveCursor('sudh', 2, 'r')
  .backSpace('sudh', 2)
  .backSpace('roy', 2);

export const TypeAnimation = () => {
  const [renderId, setRenderId] = useState<string>(uuid());

  useEffect(() => {
    multiCursor.addStateChangeCallBack(() => setRenderId(uuid())).start();
  }, []);

  return (
    <div className={'bg-slate-800 h-40'} id={renderId}>
      <motion.div
        className={'border-4 border-slate-500/30 h-full border-r-4'}
        style={{ background: '#1d1e22' }}
      >
        {renderTextAndCursors(multiCursor.getText(), multiCursor.getCursors())}
      </motion.div>
    </div>
  );
};

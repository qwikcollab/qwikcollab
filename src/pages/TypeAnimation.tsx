import { useEffect, useState } from 'react';
import MultiCursor from '../lib/MultiCursor';
import { v4 as uuid } from 'uuid';
import { renderTextAndCursors } from '../lib/MultiCursorRenderer';

const multiCursor = new MultiCursor({
  startText: 'Collaborative editor for busy engineers',
  initialCursors: [
    {
      name: 'Sudheer',
      id: 'sudh',
      cursorStyles: {
        title: 'bg-green-500',
        line: 'border-green-500',
        selectedText: 'bg-green-600'
      },
      pos: 15
    }
  ]
})
  .moveCursor('sudh', 4, 'l')
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
  .type('sudh', 'code')
  .backSpace('roy')
  .type('roy', 'dev')
  .addCursor({
    name: 'Denver',
    id: 'dv',
    pos: 1,
    cursorStyles: {
      title: 'bg-red-500',
      line: 'border-red-500',
      selectedText: 'bg-red-600'
    }
  })
  .cursorDragStart('dv')
  .moveCursor('dv', 11, 'r');

export const TypeAnimation = () => {
  const [renderId, setRenderId] = useState<string>(uuid());

  useEffect(() => {
    multiCursor.addStateChangeCallBack(() => setRenderId(uuid())).start();
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-3/4 h-4/5 bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        <div className="h-10 bg-gray-800 flex items-center justify-between px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-white text-sm">QwikCollab</span>
        </div>
        <div className="h-full bg-black text-white text-sm font-mono p-4" style={{background:'#1d1e22'}}>
          <pre id={renderId}>
            {renderTextAndCursors(multiCursor.getText(), multiCursor.getCursors())}
          </pre>
        </div>
      </div>
    </div>
  );
};

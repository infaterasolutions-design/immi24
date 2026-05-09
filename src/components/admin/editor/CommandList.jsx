import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const CommandList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (!props.items.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden w-64 max-h-80 overflow-y-auto flex flex-col py-1">
      {props.items.map((item, index) => (
        <button
          key={index}
          className={`flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
            index === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
          }`}
          onClick={() => selectItem(index)}
        >
          {item.icon && <span className="flex items-center justify-center w-6 h-6 text-slate-500">{item.icon}</span>}
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
});

CommandList.displayName = 'CommandList';
export default CommandList;

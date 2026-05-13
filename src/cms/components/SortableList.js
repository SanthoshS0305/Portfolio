import React from 'react';

const SortableList = ({ items, renderItem, onMoveUp, onMoveDown, onDelete, getId, getLabel }) => {
  const s = {
    list: { display: 'flex', flexDirection: 'column', gap: '8px' },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(247,247,247,0.1)',
      borderRadius: '8px',
    },
    label: { flex: 1, fontSize: '14px', color: '#F7F7F7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    btn: (color) => ({
      padding: '4px 8px',
      background: 'transparent',
      border: `1px solid ${color}`,
      color,
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      flexShrink: 0,
    }),
  };

  return (
    <div style={s.list}>
      {items.map((item, idx) => {
        const id = getId(item);
        return (
          <div key={id} style={s.row}>
            <span style={s.label}>{getLabel(item)}</span>
            {renderItem && renderItem(item)}
            <button type="button" style={s.btn('#aaa')} onClick={() => onMoveUp(idx)} disabled={idx === 0} title="Move up">↑</button>
            <button type="button" style={s.btn('#aaa')} onClick={() => onMoveDown(idx)} disabled={idx === items.length - 1} title="Move down">↓</button>
            <button type="button" style={s.btn('#ff6b6b')} onClick={() => onDelete(id)} title="Delete">✕</button>
          </div>
        );
      })}
    </div>
  );
};

export default SortableList;

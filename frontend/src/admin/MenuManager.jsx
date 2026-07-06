import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getMenu, saveMenu } from '../services/api';

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await getMenu('main-menu');
      setItems(res.data.items || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleAdd = () => {
    if (!newLabel || !newLink) return;
    const newItem = { label: newLabel, link: newLink, order: items.length };
    setItems([...items, newItem]);
    setNewLabel('');
    setNewLink('');
  };

  const handleDelete = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSave = async () => {
    try {
      await saveMenu({ name: 'main-menu', items });
      alert('Menu đã được lưu!');
    } catch (error) {
      alert('Lỗi khi lưu menu!');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý Menu</h1>
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant mb-6">
        <div className="flex gap-4 mb-4">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Nhãn (VD: Trang chủ)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <input
            className="border p-2 rounded flex-1"
            placeholder="Đường dẫn (VD: /)"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <button onClick={handleAdd} className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded font-bold">
            Thêm
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="menu">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {items.map((item, index) => (
                  <Draggable key={`${item.label}-${index}`} draggableId={`item-${index}`} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex justify-between items-center bg-surface-container-low p-3 rounded border border-outline-variant"
                      >
                        <span>{item.label} - {item.link}</span>
                        <button onClick={() => handleDelete(index)} className="text-error hover:underline">Xóa</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <button onClick={handleSave} className="mt-4 bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded font-bold">
          Lưu menu
        </button>
      </div>
    </div>
  );
};

export default MenuManager;
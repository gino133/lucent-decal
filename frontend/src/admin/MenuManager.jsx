import { useState, useEffect } from 'react';
import { getMenu, saveMenu } from '../services/api';
import { useForm, useFieldArray } from 'react-hook-form';

const MenuManager = () => {
  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: { name: 'main-menu', items: [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    getMenu('main-menu').then(res => {
      setValue('items', res.data.items || []);
    }).catch(() => {});
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await saveMenu(data);
      alert('Menu đã được cập nhật!');
    } catch (err) {
      alert('Lỗi khi lưu menu');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Menu chính</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-center border-b pb-2">
            <input {...register(`items.${index}.label`)} placeholder="Nhãn" className="border p-2 flex-1" />
            <input {...register(`items.${index}.link`)} placeholder="Đường dẫn" className="border p-2 flex-1" />
            <input {...register(`items.${index}.order`)} type="number" className="border p-2 w-16" />
            <button type="button" onClick={() => remove(index)} className="bg-error text-white px-3 py-1 rounded">Xóa</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ label: '', link: '', order: fields.length })} className="bg-secondary-fixed px-4 py-2 rounded">+ Thêm mục</button>
        <button type="submit" className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded font-bold">Lưu menu</button>
      </form>
    </div>
  );
};

export default MenuManager;
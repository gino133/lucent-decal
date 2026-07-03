import { useState, useEffect } from 'react';
import { getSetting, saveSetting } from '../services/api';
import { useForm } from 'react-hook-form';

const Settings = () => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { typography: {} }
  });

  useEffect(() => {
    getSetting('typography').then(res => {
      setValue('typography', res.data.value || {});
    }).catch(() => {});
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await saveSetting({ key: 'typography', value: data.typography });
      alert('Cài đặt đã được lưu!');
    } catch (err) {
      alert('Lỗi khi lưu cài đặt');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cài đặt giao diện</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="block font-bold">Font tiêu đề</label>
          <input {...register('typography.headingFont')} className="w-full border p-2 rounded" placeholder="Montserrat" />
        </div>
        <div>
          <label className="block font-bold">Font nội dung</label>
          <input {...register('typography.bodyFont')} className="w-full border p-2 rounded" placeholder="Inter" />
        </div>
        <div>
          <label className="block font-bold">Cỡ chữ tiêu đề (px)</label>
          <input {...register('typography.headingSize')} className="w-full border p-2 rounded" placeholder="64" />
        </div>
        <div>
          <label className="block font-bold">Cỡ chữ nội dung (px)</label>
          <input {...register('typography.bodySize')} className="w-full border p-2 rounded" placeholder="16" />
        </div>
        <button type="submit" className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded font-bold">Lưu cài đặt</button>
      </form>
    </div>
  );
};

export default Settings;
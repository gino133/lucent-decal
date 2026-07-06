import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getSetting, saveSetting } from '../services/api';

const Settings = () => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      typography: {
        headingFont: 'Montserrat',
        bodyFont: 'Inter',
        headingSize: '64',
        bodySize: '16'
      },
      colors: {
        primary: '#5f5f59',
        secondary: '#fae519',
        background: '#fbf9f9'
      },
      siteName: 'Lucent Glass',
      siteDescription: 'Kiến tạo không gian kiến trúc'
    }
  });

  useEffect(() => {
    // Load settings từ DB
    getSetting('typography').then(res => {
      setValue('typography', res.data.value);
    }).catch(() => {});
    getSetting('colors').then(res => {
      setValue('colors', res.data.value);
    }).catch(() => {});
    getSetting('siteInfo').then(res => {
      setValue('siteName', res.data.value.siteName);
      setValue('siteDescription', res.data.value.siteDescription);
    }).catch(() => {});
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await saveSetting({ key: 'typography', value: data.typography });
      await saveSetting({ key: 'colors', value: data.colors });
      await saveSetting({ key: 'siteInfo', value: { siteName: data.siteName, siteDescription: data.siteDescription } });
      alert('Cài đặt đã được lưu!');
    } catch (error) {
      alert('Lỗi khi lưu cài đặt!');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cài đặt</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-sm">Tên website</label>
            <input {...register('siteName')} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-bold text-sm">Mô tả website</label>
            <input {...register('siteDescription')} className="w-full border p-2 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block font-bold text-sm">Font tiêu đề</label>
            <input {...register('typography.headingFont')} className="w-full border p-2 rounded" placeholder="Montserrat" />
          </div>
          <div>
            <label className="block font-bold text-sm">Font nội dung</label>
            <input {...register('typography.bodyFont')} className="w-full border p-2 rounded" placeholder="Inter" />
          </div>
          <div>
            <label className="block font-bold text-sm">Cỡ chữ tiêu đề (px)</label>
            <input {...register('typography.headingSize')} type="number" className="w-full border p-2 rounded" placeholder="64" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block font-bold text-sm">Màu chính</label>
            <input {...register('colors.primary')} type="color" className="w-full h-12 p-1 rounded border" />
          </div>
          <div>
            <label className="block font-bold text-sm">Màu phụ (vàng)</label>
            <input {...register('colors.secondary')} type="color" className="w-full h-12 p-1 rounded border" />
          </div>
          <div>
            <label className="block font-bold text-sm">Màu nền</label>
            <input {...register('colors.background')} type="color" className="w-full h-12 p-1 rounded border" />
          </div>
        </div>
        <button type="submit" className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded font-bold">
          Lưu cài đặt
        </button>
      </form>
    </div>
  );
};

export default Settings;
import React from 'react';
import { useFormContext } from 'react-hook-form';
import HeroForm from './SectionForms/HeroForm';
import IntroForm from './SectionForms/IntroForm';
import ProductGridForm from './SectionForms/ProductGridForm';
import ProjectGridForm from './SectionForms/ProjectGridForm';
import CTAForm from './SectionForms/CTAForm';
import TeamForm from './SectionForms/TeamForm';
import TimelineForm from './SectionForms/TimelineForm';
import TestimonialForm from './SectionForms/TestimonialForm';
import StatsForm from './SectionForms/StatsForm';

const AdminSectionEditor = ({ index, onRemove, onMoveUp, onMoveDown }) => {
  const { register, watch } = useFormContext();
  const type = watch(`sections.${index}.type`);

  const renderForm = () => {
    switch (type) {
      case 'hero': return <HeroForm index={index} />;
      case 'intro': return <IntroForm index={index} />;
      case 'product-grid': return <ProductGridForm index={index} />;
      case 'project-grid': return <ProjectGridForm index={index} />;
      case 'cta': return <CTAForm index={index} />;
      case 'team': return <TeamForm index={index} />;
      case 'timeline': return <TimelineForm index={index} />;
      case 'testimonial': return <TestimonialForm index={index} />;
      case 'stats': return <StatsForm index={index} />;
      default: return <p className="text-error">Chưa hỗ trợ loại section này</p>;
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-6 bg-surface shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm">Section #{index + 1}</span>
          <select {...register(`sections.${index}.type`)} className="border p-2 rounded bg-surface">
            <option value="hero">Hero</option>
            <option value="intro">Intro</option>
            <option value="product-grid">Product Grid</option>
            <option value="project-grid">Project Grid</option>
            <option value="cta">CTA</option>
            <option value="team">Team</option>
            <option value="timeline">Timeline</option>
            <option value="testimonial">Testimonial</option>
            <option value="stats">Stats</option>
          </select>
          <input {...register(`sections.${index}.order`)} type="number" className="w-16 border p-2 rounded" placeholder="Order" />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onMoveUp} className="bg-surface-container-high px-3 py-1 rounded hover:bg-surface-container">↑</button>
          <button type="button" onClick={onMoveDown} className="bg-surface-container-high px-3 py-1 rounded hover:bg-surface-container">↓</button>
          <button type="button" onClick={onRemove} className="bg-error-container text-error px-3 py-1 rounded hover:bg-error hover:text-white">Xóa</button>
        </div>
      </div>
      {renderForm()}
    </div>
  );
};

export default AdminSectionEditor;
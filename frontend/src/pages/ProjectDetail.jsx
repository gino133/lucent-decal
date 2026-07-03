import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../services/api';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProject(slug)
      .then(res => setProject(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center">Đang tải...</div>;
  if (!project) return <div className="pt-32 text-center">Không tìm thấy dự án</div>;

  return (
    <main className="pt-32 pb-16">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${project.coverImage})` }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 bg-secondary-fixed/20 text-secondary font-label-bold text-label-sm mb-6 uppercase tracking-widest">{project.category}</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-6 leading-none">{project.name}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">{project.description}</p>
            <div className="flex gap-4 flex-wrap">
              {project.location && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <span className="font-label-bold text-label-bold">{project.location}</span>
                </div>
              )}
              {project.year && (
                <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
                  <span className="material-symbols-outlined text-secondary">calendar_today</span>
                  <span className="font-label-bold text-label-bold">{project.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Chi tiết */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-6">Thách thức</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{project.challenge || 'Không có thông tin'}</p>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-6">Giải pháp</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{project.solution || 'Không có thông tin'}</p>
          </div>
        </div>
        {project.stats && Object.keys(project.stats).length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {Object.entries(project.stats).map(([key, value]) => (
              <div key={key}>
                <div className="text-secondary font-headline-xl text-headline-lg">{value}</div>
                <div className="font-label-bold text-label-bold uppercase tracking-wider opacity-60">{key}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gallery */}
      {project.images?.length > 0 && (
        <section className="py-16 bg-surface-container-low">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <h2 className="font-headline-lg text-headline-lg mb-8">Bộ sưu tập hình ảnh</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.images.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg">
                  <img src={img} alt={`${project.name} ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ProjectDetail;
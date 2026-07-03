import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tất cả');

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = filter === 'Tất cả' ? projects : projects.filter(p => p.category === filter);

  if (loading) return <div className="pt-32 text-center">Đang tải dự án...</div>;

  return (
    <main className="pt-32 pb-16">
      <header className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest mb-4 block">Hành trình sáng tạo</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-6">Dự án Tiêu biểu</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Khám phá cách chúng tôi biến đổi không gian kiến trúc thông qua nghệ thuật kính và decal cao cấp.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 border-b border-outline-variant/30 pb-2">
            {['Tất cả', 'Văn phòng', 'Nhà ở', 'Thương mại'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-label-bold text-label-bold py-2 px-4 transition-all ${filter === cat ? 'text-on-surface border-b-2 border-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {filteredProjects.length === 0 ? (
          <p className="text-center text-on-surface-variant">Không có dự án nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {filteredProjects.map((project, idx) => {
              const colSpan = idx === 0 ? 'md:col-span-8 row-span-2' : 'md:col-span-4 row-span-1';
              return (
                <div key={project.slug} className={`${colSpan} group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-auto bg-surface-container shadow-sm hover:shadow-md transition-all`}>
                  <Link to={`/du-an/${project.slug}`} className="block w-full h-full">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${project.coverImage})` }}></div>
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-on-surface/80 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-1">{project.category}</span>
                      <h3 className="font-headline-md text-headline-md text-white">{project.name}</h3>
                      <p className="font-body-md text-white/80 mt-1">{project.location}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Projects;
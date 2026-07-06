const ProjectGrid = ({ content, style }) => {
  const { title, subtitle, projects, viewAllLink } = content || {};
  const {
    maxWidth = '1280px',
    textAlign = 'left',
    paddingTop = '0px',
    paddingBottom = '0px',
    marginTop = '0px',
    marginBottom = '0px',
    backgroundColor = 'transparent',
    backgroundImage = ''
  } = style || {};

  return (
    <section
      className="py-16 md:py-32 bg-surface-container-lowest px-margin-mobile md:px-margin-desktop mx-auto"
      style={{
        maxWidth,
        textAlign,
        paddingTop: paddingTop + 'px',
        paddingBottom: paddingBottom + 'px',
        marginTop: marginTop + 'px',
        marginBottom: marginBottom + 'px',
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: backgroundImage ? 'cover' : 'auto',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">{title || 'Dự án tiêu biểu'}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{subtitle || 'Khám phá cách chúng tôi thay đổi diện mạo các công trình kiến trúc.'}</p>
        </div>
        {viewAllLink && (
          <a href={viewAllLink} className="font-label-bold text-label-bold text-secondary-fixed-dim hover:text-secondary-fixed transition-colors flex items-center group">
            Xem tất cả dự án <span className="material-symbols-outlined ml-2 group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </a>
        )}
      </div>
      <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[600px] md:h-[800px]">
        {projects && projects.map((project, idx) => {
          const colSpan = idx === 0 ? 'col-span-12 md:col-span-8 row-span-2' : 'col-span-6 md:col-span-4 row-span-1';
          return (
            <div key={idx} className={`${colSpan} relative group overflow-hidden rounded-xl`}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${project.image})` }}></div>
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-on-surface/80 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="font-label-bold text-label-bold text-secondary mb-2 block uppercase tracking-widest">{project.category}</span>
                <h3 className="font-headline-md text-headline-md text-background">{project.name}</h3>
                <p className="font-body-md text-body-md text-background/80 hidden md:block">{project.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default ProjectGrid;

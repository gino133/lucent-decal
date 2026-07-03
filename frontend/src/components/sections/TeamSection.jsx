const TeamSection = ({ content, style }) => {
  const { title, subtitle, members } = content;
  return (
    <section className="py-16 md:py-24 bg-surface-container" style={{ backgroundColor: style?.backgroundColor }}>
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-4">{title || 'Đội ngũ chuyên gia'}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">{subtitle || 'Những con người tâm huyết đứng sau các công trình kính mang tính biểu tượng.'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members && members.map((member, idx) => (
            <div key={idx} className="group">
              <div className="aspect-[3/4] bg-cover bg-center mb-4 grayscale hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: `url(${member.image})` }}></div>
              <h5 className="font-headline-md text-headline-md mb-1">{member.name}</h5>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-tighter">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TeamSection;
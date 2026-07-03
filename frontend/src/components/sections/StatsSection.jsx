const StatsSection = ({ content, style }) => {
  const { title, stats } = content;
  return (
    <section className="py-16 md:py-24 bg-inverse-surface text-surface" style={{ backgroundColor: style?.backgroundColor }}>
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <h2 className="font-headline-lg text-headline-lg text-center mb-12">{title || 'Thành tựu của chúng tôi'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats && stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-secondary-fixed font-headline-xl text-headline-lg">{stat.value}</div>
              <div className="font-label-bold text-label-bold uppercase tracking-wider opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default StatsSection;
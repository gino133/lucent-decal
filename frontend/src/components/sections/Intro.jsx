const Intro = ({ content, style }) => {
  const { heading, text, stats } = content;
  return (
    <section className="py-16 md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" style={{ backgroundColor: style.backgroundColor }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-6">{heading || 'Độ chính xác trong từng milimet'}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">{text || 'Tại Lucent Glass, chúng tôi không chỉ cung cấp decal, chúng tôi kiến tạo trải nghiệm không gian...'}</p>
          {stats && (
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <span className="font-headline-lg text-headline-lg text-secondary mb-2">{stat.value}</span>
                  <span className="font-label-bold text-label-bold text-on-surface-variant block">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Có thể thêm ảnh minh họa từ content.images */}
          <div className="aspect-[4/5] rounded-xl bg-cover bg-center overflow-hidden shadow-sm" style={{ backgroundImage: `url(${content.image1})` }}></div>
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-xl bg-cover bg-center overflow-hidden shadow-sm" style={{ backgroundImage: `url(${content.image2})` }}></div>
            <div className="glass-card p-4 rounded-xl">
              <span className="material-symbols-outlined text-secondary text-3xl mb-2">texture</span>
              <h3 className="font-headline-md text-headline-md mb-1">Phủ mờ</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Giải pháp mờ kính tinh tế cho phòng họp và văn phòng riêng.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
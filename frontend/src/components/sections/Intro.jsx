import React from 'react';

const Intro = ({ content, style = {} }) => {
  const { heading, text, stats, image1, image2 } = content;
  const {
    maxWidth = '1280px',
    textAlign = 'left',
    paddingTop = 0,
    paddingBottom = 0,
    marginTop = 0,
    marginBottom = 0,
    backgroundColor = 'transparent',
    backgroundImage = ''
  } = style;

  return (
    <section
      className="py-16 md:py-32 px-margin-mobile md:px-margin-desktop mx-auto"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-6">
            {heading || 'Độ chính xác trong từng milimet'}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            {text || 'Tại Lucent Glass, chúng tôi không chỉ cung cấp decal, chúng tôi kiến tạo trải nghiệm không gian...'}
          </p>
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <span className="font-headline-lg text-headline-lg text-secondary mb-2 block">{stat.value}</span>
                  <span className="font-label-bold text-label-bold text-on-surface-variant">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {image1 && (
            <div
              className="aspect-[4/5] rounded-xl bg-cover bg-center overflow-hidden shadow-sm"
              style={{ backgroundImage: `url(${image1})` }}
            ></div>
          )}
          <div className="space-y-4">
            {image2 && (
              <div
                className="aspect-[4/5] rounded-xl bg-cover bg-center overflow-hidden shadow-sm"
                style={{ backgroundImage: `url(${image2})` }}
              ></div>
            )}
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
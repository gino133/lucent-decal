import React from 'react';

const CTA = ({ content, style = {} }) => {
  const { heading, subheading, buttons } = content;
  const {
    maxWidth = '1280px',
    textAlign = 'center',
    paddingTop = 0,
    paddingBottom = 0,
    marginTop = 0,
    marginBottom = 0,
    backgroundColor = 'transparent',
    backgroundImage = ''
  } = style;

  return (
    <section
      className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop mx-auto"
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
      <div className="bg-primary-container p-8 md:p-16 rounded-2xl relative overflow-hidden border border-outline-variant">
        <div className="relative z-10">
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-6">
            {heading || 'Bạn đã sẵn sàng để thay đổi không gian?'}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
            {subheading || 'Liên hệ ngay để nhận khảo sát miễn phí và báo giá chi tiết cho giải pháp decal kính nghệ thuật chuyên nghiệp nhất.'}
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            {buttons && buttons.map((btn, i) => (
              <button
                key={i}
                className={`font-label-bold text-label-bold px-8 md:px-12 py-4 md:py-5 rounded-lg active:scale-95 transition-all ${
                  btn.variant === 'primary'
                    ? 'bg-secondary-fixed text-on-secondary-fixed shadow-md'
                    : 'border border-outline hover:bg-surface-container transition-all'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
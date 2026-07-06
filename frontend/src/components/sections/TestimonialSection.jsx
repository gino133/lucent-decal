import React from 'react';

const Testimonial = ({ content, style = {} }) => {
  const { quote, author, role, avatar } = content;
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
      <span
        className="material-symbols-outlined text-secondary text-5xl mb-6"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        format_quote
      </span>
      <blockquote className="font-headline-md text-headline-lg max-w-3xl mx-auto mb-8 leading-tight">
        {quote || 'GLAZED không chỉ cung cấp decal, họ mang đến một ngôn ngữ thiết kế hoàn toàn mới cho văn phòng chúng tôi.'}
      </blockquote>
      <div className="flex flex-col items-center">
        {avatar && (
          <div
            className="w-16 h-16 rounded-full bg-cover bg-center mb-4"
            style={{ backgroundImage: `url(${avatar})` }}
          ></div>
        )}
        <div className="font-label-bold text-label-bold">{author || 'Nguyễn Phương Linh'}</div>
        <div className="text-on-surface-variant text-sm">{role || 'Giám đốc Vận hành'}</div>
      </div>
    </section>
  );
};

export default Testimonial;
import React from 'react';

const Stats = ({ content, style = {} }) => {
  const { title, stats } = content;
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
      <h2 className="font-headline-lg text-headline-lg text-center mb-12">{title || 'Thành tựu của chúng tôi'}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats && stats.map((stat, idx) => (
          <div key={idx}>
            <div className="text-secondary-fixed font-headline-xl text-headline-lg">{stat.value}</div>
            <div className="font-label-bold text-label-bold uppercase tracking-wider opacity-70">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
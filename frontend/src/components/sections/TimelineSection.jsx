import React from 'react';

const Timeline = ({ content, style = {} }) => {
  const { title, events } = content;
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
      <div className="max-w-4xl mx-auto">
        <h2 className="font-headline-lg text-headline-lg mb-12 text-center">{title || 'Hành trình phát triển'}</h2>
        <div className="relative border-l-2 border-on-surface/10 ml-4 md:ml-0">
          {events && events.map((event, idx) => (
            <div key={idx} className="mb-12 relative pl-8">
              <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-secondary-fixed border-4 border-surface"></div>
              <span className="font-label-bold text-label-bold text-secondary mb-2 block">{event.year}</span>
              <h4 className="font-headline-md text-headline-md mb-2">{event.title}</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
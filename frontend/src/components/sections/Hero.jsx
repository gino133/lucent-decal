const Hero = ({ content, style }) => {
  const { heading, subheading, image, buttons } = content;
  const {
    maxWidth = '100%',
    textAlign = 'left',
    paddingTop = 0,
    paddingBottom = 0,
    marginTop = 0,
    marginBottom = 0,
    backgroundColor = 'transparent',
    backgroundImage = ''
  } = style || {};

  return (
    <section
      className="relative w-full overflow-hidden flex items-center px-margin-mobile md:px-margin-desktop"
      style={{
        maxWidth,
        textAlign,
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: backgroundImage ? 'cover' : 'auto',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 z-0">
        {image && (
          <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: `url(${image})` }}></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-3xl">
        <h1 className="font-headline-xl text-headline-xl text-on-background mb-6">{heading}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">{subheading}</p>
        <div className="flex items-center space-x-4 flex-wrap gap-y-2">
          {buttons && buttons.map((btn, i) => (
            <button key={i} className={`font-label-bold text-label-bold px-10 py-4 rounded-lg active:scale-95 transition-all ${btn.variant === 'primary' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'border-2 border-on-surface text-on-surface hover:bg-on-surface hover:text-background'}`}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
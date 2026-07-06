const ProductGrid = ({ content, style }) => {
  const { title, subtitle, products, viewAllLink } = content || {};
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
      <div className="flex justify-between items-end mb-12">
        <div>
          {title && <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">{title}</h2>}
          {subtitle && <p className="font-body-lg text-body-lg text-on-surface-variant">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <a href={viewAllLink} className="font-label-bold text-label-bold text-on-surface border-b border-secondary pb-1 hover:text-secondary transition-colors flex items-center group">
            Xem tất cả sản phẩm <span className="material-symbols-outlined ml-2 group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {products && products.map((product, idx) => (
          <div key={idx} className="group flex flex-col gap-4">
            <div className="relative aspect-square rounded-xl bg-surface-container overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {product.badge && <span className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full">{product.badge}</span>}
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{product.name}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-label-bold text-label-bold text-on-surface">{product.price}</span>
                <button className="bg-secondary-container text-on-secondary-container p-2.5 rounded-lg active:scale-95 transition-transform hover:shadow-md">
                  <span className="material-symbols-outlined">shopping_cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default ProductGrid;

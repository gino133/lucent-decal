const TestimonialSection = ({ content, style }) => {
  const { quote, author, role, avatar } = content;
  return (
    <section className="py-16 md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center" style={{ backgroundColor: style?.backgroundColor }}>
      <span className="material-symbols-outlined text-secondary text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
      <blockquote className="font-headline-md text-headline-lg max-w-3xl mx-auto mb-8 leading-tight">
        {quote || 'GLAZED không chỉ cung cấp decal, họ mang đến một ngôn ngữ thiết kế hoàn toàn mới cho văn phòng chúng tôi.'}
      </blockquote>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-cover bg-center mb-4" style={{ backgroundImage: `url(${avatar})` }}></div>
        <div className="font-label-bold text-label-bold">{author || 'Nguyễn Phương Linh'}</div>
        <div className="text-on-surface-variant text-sm">{role || 'Giám đốc Vận hành'}</div>
      </div>
    </section>
  );
};
export default TestimonialSection;
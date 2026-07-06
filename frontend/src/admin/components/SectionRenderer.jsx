import Hero from './sections/Hero';
import Intro from './sections/Intro';
import ProductGrid from './sections/ProductGrid';
import ProjectGrid from './sections/ProjectGrid';
import CTA from './sections/CTA';
import Team from './sections/Team';
import Timeline from './sections/Timeline';
import Testimonial from './sections/Testimonial';
import Stats from './sections/Stats';

const SectionRenderer = ({ section }) => {
  const { type, content, style } = section;
  const commonProps = { content, style };

  switch (type) {
    case 'hero': return <Hero {...commonProps} />;
    case 'intro': return <Intro {...commonProps} />;
    case 'product-grid': return <ProductGrid {...commonProps} />;
    case 'project-grid': return <ProjectGrid {...commonProps} />;
    case 'cta': return <CTA {...commonProps} />;
    case 'team': return <Team {...commonProps} />;
    case 'timeline': return <Timeline {...commonProps} />;
    case 'testimonial': return <Testimonial {...commonProps} />;
    case 'stats': return <Stats {...commonProps} />;
    default: return null;
  }
};

export default SectionRenderer;
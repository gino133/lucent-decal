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
  switch (section.type) {
    case 'hero': return <Hero content={section.content} style={section.style} />;
    case 'intro': return <Intro content={section.content} style={section.style} />;
    case 'product-grid': return <ProductGrid content={section.content} style={section.style} />;
    case 'project-grid': return <ProjectGrid content={section.content} style={section.style} />;
    case 'cta': return <CTA content={section.content} style={section.style} />;
    case 'team': return <Team content={section.content} style={section.style} />;
    case 'timeline': return <Timeline content={section.content} style={section.style} />;
    case 'testimonial': return <Testimonial content={section.content} style={section.style} />;
    case 'stats': return <Stats content={section.content} style={section.style} />;
    default: return null;
  }
};

export default SectionRenderer;
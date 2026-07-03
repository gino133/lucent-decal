import Hero from './sections/Hero';
import Intro from './sections/Intro';
import ProductGrid from './sections/ProductGrid';
import ProjectGrid from './sections/ProjectGrid';
import CTASection from './sections/CTASection';
import TeamSection from './sections/TeamSection';
import TimelineSection from './sections/TimelineSection';
import TestimonialSection from './sections/TestimonialSection';
import StatsSection from './sections/StatsSection';

const SectionRenderer = ({ section }) => {
  switch (section.type) {
    case 'hero': return <Hero content={section.content} style={section.style} />;
    case 'intro': return <Intro content={section.content} style={section.style} />;
    case 'product-grid': return <ProductGrid content={section.content} style={section.style} />;
    case 'project-grid': return <ProjectGrid content={section.content} style={section.style} />;
    case 'cta': return <CTASection content={section.content} style={section.style} />;
    case 'team': return <TeamSection content={section.content} style={section.style} />;
    case 'timeline': return <TimelineSection content={section.content} style={section.style} />;
    case 'testimonial': return <TestimonialSection content={section.content} style={section.style} />;
    case 'stats': return <StatsSection content={section.content} style={section.style} />;
    default: return null;
  }
};

export default SectionRenderer;
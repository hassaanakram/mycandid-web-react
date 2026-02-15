import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}

export function SEOHead({
  title = 'MyCandid - Authentic Social Media Platform | Real Moments, Real Connections',
  description = 'Join MyCandid, the social media platform where authenticity is everything. Share only what you capture in the moment. No filters, no fake content - just real human connections.',
  keywords = 'authentic social media, real moments, genuine connections, unfiltered content, capture only app, authentic social network, candid moments, real social media, social media for real people',
  ogImage = 'https://images.unsplash.com/photo-1765294661150-130e24807964?w=1200&h=630&fit=crop',
  url = 'https://www.mycandid.social'
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', 'website', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'MyCandid');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }, [title, description, keywords, ogImage, url]);

  return null;
}

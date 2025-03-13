
export interface Article {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  creator?: string;
  categories?: string[];
  content?: string;
  imageUrl?: string;
}

// Function to extract image URL from content or description
const extractImageUrl = (content: string): string | undefined => {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
};

// Function to clean HTML from description
const cleanDescription = (html: string): string => {
  // Remove all HTML tags
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const fetchRssFeed = async (url: string): Promise<Article[]> => {
  try {
    // Using a CORS proxy to fetch the RSS feed
    const corsProxy = 'https://api.allorigins.win/get?url=';
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`${corsProxy}${encodedUrl}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const xmlStr = data.contents;
    
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing error: ' + parserError.textContent);
    }
    
    // Get all items
    const items = xmlDoc.querySelectorAll('item');
    
    // Convert to Article objects
    const articles: Article[] = Array.from(items).map((item, index) => {
      const title = item.querySelector('title')?.textContent || 'No title';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const creator = item.querySelector('dc\\:creator')?.textContent || 
                      item.querySelector('creator')?.textContent;
      
      const categoryElements = item.querySelectorAll('category');
      const categories = Array.from(categoryElements).map(cat => cat.textContent || '').filter(Boolean);
      
      // Get content:encoded or fall back to description
      const content = item.querySelector('content\\:encoded')?.textContent || 
                      item.querySelector('encoded')?.textContent || 
                      description;
      
      // Extract image URL from content or description
      const imageUrl = extractImageUrl(content) || extractImageUrl(description);
      
      // Clean description
      const cleanDesc = cleanDescription(description);
      
      return {
        id: `article-${index}-${Date.now()}`,
        title,
        link,
        description: cleanDesc,
        pubDate,
        creator,
        categories,
        content,
        imageUrl
      };
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    return [];
  }
};

// Format the publication date
export const formatDate = (pubDate: string): string => {
  try {
    const date = new Date(pubDate);
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    return pubDate;
  }
};

// Function to create excerpt
export const createExcerpt = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  
  // Find the last space before maxLength
  const lastSpace = text.lastIndexOf(' ', maxLength);
  if (lastSpace === -1) return text.substring(0, maxLength) + '...';
  
  return text.substring(0, lastSpace) + '...';
};

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  credibilityScore: number;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  tags: string[];
  location?: string;
  verified: boolean;
}

interface NewsContextType {
  articles: NewsArticle[];
  loading: boolean;
  fetchNews: (category?: string) => Promise<void>;
  analyzeNews: (content: string) => Promise<number>;
  voteOnArticle: (articleId: string, vote: 'up' | 'down') => void;
  savedArticles: string[];
  toggleSaveArticle: (articleId: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
    // Load saved articles from localStorage
    const saved = localStorage.getItem('ziptales_saved');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);

  const fetchNews = async (category?: string) => {
    setLoading(true);
    try {
      // Mock news data with credibility scores
      const mockArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'AI Technology Breakthrough in Medical Diagnosis',
          summary: 'Researchers develop new AI system that can detect diseases with 95% accuracy, potentially revolutionizing healthcare diagnostics.',
          content: 'A groundbreaking AI system developed by researchers at leading universities has achieved remarkable accuracy in medical diagnosis...',
          author: 'Dr. Sarah Johnson',
          source: 'TechMed Today',
          publishedAt: '2025-01-15T10:30:00Z',
          imageUrl: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
          category: 'Technology',
          credibilityScore: 85,
          votes: { upvotes: 142, downvotes: 8 },
          tags: ['AI', 'Healthcare', 'Technology'],
          location: 'Stanford, CA',
          verified: true
        },
        {
          id: '2',
          title: 'Climate Change Summit Reaches Historic Agreement',
          summary: 'World leaders agree on ambitious carbon reduction targets, marking a significant step in global climate action.',
          content: 'In a historic moment for environmental policy, world leaders have reached a comprehensive agreement...',
          author: 'Michael Chen',
          source: 'Global News Network',
          publishedAt: '2025-01-15T08:15:00Z',
          imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
          category: 'Politics',
          credibilityScore: 78,
          votes: { upvotes: 89, downvotes: 12 },
          tags: ['Climate', 'Politics', 'Environment'],
          location: 'Geneva, Switzerland',
          verified: true
        },
        {
          id: '3',
          title: 'Controversial Social Media Policy Changes',
          summary: 'Major platform announces significant changes to content moderation policies, sparking debate among users and experts.',
          content: 'The announcement has generated mixed reactions from users, privacy advocates, and industry experts...',
          author: 'Anonymous Source',
          source: 'Social Media Insider',
          publishedAt: '2025-01-14T16:45:00Z',
          imageUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
          category: 'Technology',
          credibilityScore: 45,
          votes: { upvotes: 34, downvotes: 67 },
          tags: ['Social Media', 'Policy', 'Privacy'],
          verified: false
        }
      ];

      // Filter by category if specified
      const filteredArticles = category 
        ? mockArticles.filter(article => article.category.toLowerCase() === category.toLowerCase())
        : mockArticles;

      setArticles(filteredArticles);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeNews = async (content: string): Promise<number> => {
    // Simulate AI analysis using multiple factors
    const factors = {
      authorReputation: Math.random() * 30,
      sourceCredibility: Math.random() * 25,
      contentQuality: Math.random() * 20,
      factualAccuracy: Math.random() * 25
    };

    const score = Object.values(factors).reduce((sum, value) => sum + value, 0);
    return Math.min(100, Math.max(0, score));
  };

  const voteOnArticle = (articleId: string, vote: 'up' | 'down') => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        const newVotes = { ...article.votes };
        if (vote === 'up') {
          newVotes.upvotes += 1;
        } else {
          newVotes.downvotes += 1;
        }
        
        // Recalculate credibility score based on votes
        const totalVotes = newVotes.upvotes + newVotes.downvotes;
        const voteRatio = totalVotes > 0 ? newVotes.upvotes / totalVotes : 0.5;
        const newScore = Math.round(article.credibilityScore * 0.6 + voteRatio * 40);
        
        return {
          ...article,
          votes: newVotes,
          credibilityScore: newScore
        };
      }
      return article;
    }));
  };

  const toggleSaveArticle = (articleId: string) => {
    setSavedArticles(prev => {
      const newSaved = prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId];
      
      localStorage.setItem('ziptales_saved', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const value = {
    articles,
    loading,
    fetchNews,
    analyzeNews,
    voteOnArticle,
    savedArticles,
    toggleSaveArticle
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};
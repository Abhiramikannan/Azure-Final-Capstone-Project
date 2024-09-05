import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

export const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: 'cryptocurrency OR bitcoin', // Fetching news related to crypto and bitcoin
            language: 'en',
            pageSize: 3, // Limit to 3 articles
            apiKey: '584c2240c03448618392b242a7a083ac', // Replace with your actual NewsAPI key
          },
        });

        setNewsData(response.data.articles);
      } catch (error) {
        console.error("Error fetching the news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <CircularProgress thickness={7} size={20} color="primary" />
        <div className="loader-caption">Fetching latest news...</div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <div className="dashboard-body-title">Latest News 📰</div>
      {newsData.map((article, index) => (
        <div className="news-card" key={index}>
          <div className="news-title">{article.title}</div>
          <div className="news-source">{article.source.name}</div>
          <div className="news-description">{article.description}</div>
          <div className="news-link">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

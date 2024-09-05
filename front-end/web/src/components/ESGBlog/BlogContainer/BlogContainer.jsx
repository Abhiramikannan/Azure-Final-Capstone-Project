import { useState, useEffect } from 'react';
import React from 'react';
import MainHeader from '../MainHeader/MainHeader';
import './style.css';
import Blog from '../Blog/Blog';
import FilterCategories from '../FilteredCategories/FilteredCategories';
import axios from 'axios';
import Quiz from './Quiz'; // Adjust the path based on your file structure

const YOUTUBE_API_KEY = 'AIzaSyDr1YvSBDfrjxfbE676-BSEqvDB9BUrpHE'; // Replace with your actual API key

const BlogContainer = () => {
  const [blogData, setBlogData] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = ['crypto', 'Stocks', 'NFTs', 'bitcoin', 'Trading'];

  useEffect(() => {
    const getBlogData = async () => {
      try {
        const response = await axios.get('http://localhost:9004/esg/getAll');
        console.log('Blog data fetched successfully:', response.data); // Console output for blog data
        setBlogData(response.data);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    getBlogData();
  }, []);

  const fetchYoutubeVideos = async (category) => {
    try {
      console.log(`Fetching YouTube videos for category: ${category}`); // Console output for fetching category
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=top+${category}+videos&key=${YOUTUBE_API_KEY}`
      );
      console.log('YouTube videos fetched successfully:', response.data.items); // Console output for fetched videos
      const videoData = response.data.items.map((item) => ({
        title: decodeHtml(item.snippet.title), // Clean the title
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.medium.url, // Fetch thumbnail
        category: category,
      }));
      setYoutubeVideos((prevVideos) => [...prevVideos, ...videoData]);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      console.log(`Removing category: ${category}`); // Console output for removing category
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
      setYoutubeVideos((prevVideos) =>
        prevVideos.filter((video) => video.category !== category)
      );
    } else {
      console.log(`Adding category: ${category}`); // Console output for adding category
      setSelectedCategories([...selectedCategories, category]);
      fetchYoutubeVideos(category);
    }
  };

  const filteredBlogItems = blogData.filter((item) =>
    selectedCategories.length === 0 ? true : selectedCategories.includes(item.category)
  );

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div>
      <MainHeader />
      <div className="esg-latest-articles">
        <h2>Latest Articles</h2>
        <FilterCategories
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
      <div className="esg-articles-container">
        {selectedCategories.length > 0 && (
          <>
            <h2>Top Videos</h2>
            <div className="esg-articles">
              {youtubeVideos.map((video, index) => (
                <div key={index} className="video-item">
                  <a href={video.url} target="_blank" rel="noreferrer">
                    <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                    <p>{video.title} - {video.category}</p>
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
        <h2>Quiz</h2>
        <div className="quiz">
          <Quiz /> {/* Add the Quiz component here */}
        </div>
        <h2>ESG Articles</h2>
        <div className="esg-articles">
          {filteredBlogItems.map((item, index) => (
            <Blog key={index} blog={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogContainer;

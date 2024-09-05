import React from 'react';
import './style.css';

const Blog = ({ blog }) => {
  return (
    blog && (
      <div className="esg-article">
        <a className="esg-article-link" href={blog.link} target="blank">
          <div className="esg-article-badge">
            <div className="esg-article-badge-text">{blog.category}</div>
          </div>
          <div className="esg-article-category">
            <div
              className="esg-article-image"
              style={{ backgroundImage: `url(${blog.image})` }}
            ></div>
            <div className="esg-article-content">
              <div className="esg-article-title">{blog.title}</div>
              <div className="esg-article-subtitle">{blog.subtitle}</div>
              <div className="esg-article-description">{blog.description}</div>
            </div>
            <div className="esg-article-author-info">
              <div className="esg-article-author-name">By {blog.authorName}</div>
            </div>
            <div className="esg-article-author-info-2">
              <span className="esg-article-author">{blog.createdAt}h ago</span>
              <span className="esg-article-read-time">
                {blog.readingTime}m read
              </span>
            </div>
          </div>
        </a>
      </div>
    )
  );
};

export default Blog;

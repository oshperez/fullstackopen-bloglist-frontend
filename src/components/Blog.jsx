import PropTypes from "prop-types";
import { useState } from "react";

const Blog = ({ blog, addLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="blog" data-cy="blog">
      {!showDetails ? (
        <span>
          {blog.title} by {blog.author}{" "}
          <button data-cy="blog-toggle" onClick={toggleDetails}>
            view
          </button>
        </span>
      ) : (
        <div >
          <div>
            <span>
              {blog.title}{" "}
              <button data-cy="blog-toggle" onClick={toggleDetails}>
                hide
              </button>
            </span>
          </div>
          <div>
            <p>{blog.url}</p>
          </div>
          <div>
            <span data-cy="blog-likes">
              likes
              <span>{blog.likes} </span>
              <button onClick={() => addLikes(blog.id)}>
                like
              </button>
            </span>
          </div>
          <div>
            <p>{blog.author}</p>
          </div>
          <button
            onClick={() => deleteBlog(blog.id)}
            className="button button__blue"
            data-cy="blog-delete"
          >
            delete
          </button>
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;

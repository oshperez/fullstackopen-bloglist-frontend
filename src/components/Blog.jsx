import PropTypes from "prop-types";
import { useState } from "react";

const Blog = ({ blog, addLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="blog">
      {!showDetails ? (
        <span>
          {blog.title} by {blog.author}{" "}
          <button onClick={toggleDetails}>view</button>
        </span>
      ) : (
        <div>
          <div>
            <span>
              {blog.title} <button onClick={toggleDetails}>hide</button>
            </span>
          </div>
          <div>
            <p>{blog.url}</p>
          </div>
          <div>
            <span>
              likes{blog.likes}{" "}
              <button onClick={() => addLikes(blog.id)}>like</button>
            </span>
          </div>
          <div>
            <p>{blog.author}</p>
          </div>
          <button
            onClick={() => deleteBlog(blog.id)}
            className="button button__blue"
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

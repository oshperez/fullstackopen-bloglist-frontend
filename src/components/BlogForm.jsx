import PropTypes from "prop-types";
import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [blog, setBlog] = useState({ title: "", author: "", url: "" });

  // Handles new blog setup
  const handleSetupBlog = (e, property) => {
    setBlog((prev) => {
      const updatedBlog = { ...prev };
      updatedBlog[property] = e.target.value;
      return updatedBlog;
    });
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(blog);
    setBlog({ title: "", author: "", url: "" });
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type="text"
          value={blog.title}
          name="title"
          onChange={(e) => handleSetupBlog(e, "title")}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={blog.author}
          name="author"
          onChange={(e) => handleSetupBlog(e, "author")}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={blog.url}
          name="url"
          onChange={(e) => handleSetupBlog(e, "url")}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;

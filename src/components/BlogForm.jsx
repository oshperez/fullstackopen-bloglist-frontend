import PropTypes from "prop-types";
import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [blog, setBlog] = useState({ title: "", author: "", url: "" });

  // Handles new blog setup
  const handleSetupBlog = (e) => {
    const { name, value } = e.target;
    setBlog((prevForm) => ({ ...prevForm, [name]: value }));
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
          id="title"
          value={blog.title}
          name="title"
          data-cy="blog-title"
          onChange={(e) => handleSetupBlog(e)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          id="author"
          value={blog.author}
          name="author"
          data-cy="blog-author"
          onChange={(e) => handleSetupBlog(e)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          id="url"
          value={blog.url}
          name="url"
          data-cy="blog-url"
          onChange={(e) => handleSetupBlog(e)}
        />
      </div>
      <button type="submit" data-cy="blog-submit">create</button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;

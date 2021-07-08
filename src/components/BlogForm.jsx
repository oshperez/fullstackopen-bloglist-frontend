const BlogForm = ({ blog, setupBlog, createBlog }) => {
  return (
    <form onSubmit={createBlog}>
      <div>
        title
        <input
          type="text"
          value={blog.title}
          name="title"
          onChange={(e) => setupBlog(e, "title")}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={blog.author}
          name="author"
          onChange={(e) => setupBlog(e, "author")}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={blog.url}
          name="url"
          onChange={(e) => setupBlog(e, "url")}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;

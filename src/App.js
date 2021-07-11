import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog.jsx";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  //Reference to blog form
  
  const blogFormRef = useRef();

  // Fetches blogs from database

  useEffect(() => {
    (async function () {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs.sort((blog1, blog2) => blog2.likes - blog1.likes));
      } catch (error) {
        setNotification({ type: "error", message: "error loading blogs" });
      }
    })();
  }, []);

  // Saves user and token to the browser's local storage

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Sets a timer to change the notification state back to null

  useEffect(() => {
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, [notification]);

  // Handles user login

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);

      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setNotification({ type: "error", message: "wrong credentials" });
    }
  };

  // Handles user logout

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    setUser(null);
  };

  // Handles blog creation

  const handleCreateBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog);
      blogFormRef.current.toggleVisibility();
      setBlogs(blogs.concat(blog));
      setNotification({
        type: "success",
        message: `a new blog ${blog.title} added`,
      });
    } catch (exception) {
      setNotification({ type: "error", message: "something went wrong" });
    }
  };

  // Adds likes to blog

  const handleAddLikes = async (id) => {
    try {
      const targetBlog = blogs.find((blog) => blog.id === id);

      const updatedBlog = await blogService.update({
        ...targetBlog,
        likes: (targetBlog.likes += 1),
      });

      const newBlogsArr = blogs.map((blog) => {
        if (blog.id === targetBlog.id) {
          return updatedBlog;
        }
        return blog;
      });

      setBlogs(newBlogsArr.sort((blog1, blog2) => blog2.likes - blog1.likes));
    } catch (error) {
      setNotification({ type: "error", message: error.message });
    }
  };

  //Deletes blog

  const handleDeleteBlog = async (id) => {
    const targetBlog = blogs.find((blog) => blog.id === id);
    if (
      window.confirm(`Remove blog ${targetBlog.title} by ${targetBlog.author}?`)
    ) {
      try {
        await blogService.deleteBlog(targetBlog.id);
        const filteredBlogs = blogs.filter((blog) => blog.id !== id);
        setBlogs(filteredBlogs);

        setNotification({
          type: "success",
          message: `${targetBlog.title} deleted`,
        });
      } catch (error) {
        setNotification({
          type: "error",
          message: `deletion failed, ${error.message}`,
        });
      }
    }
  };

  // Returns blog form

  const blogForm = () => {
    return (
      <Togglable buttonLabel="add blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
    );
  };

  return (
    <div className="container">
      {notification && <Notification notification={notification} />}
      <div className="app">
        {!user ? <LoginForm login={handleLogin} /> : null}
        {user ? (
          <div>
            <h2>blogs</h2>
            <div>
              <span>
                {`${user.name} logged in`}{" "}
                <button onClick={handleLogout}>logout</button>
              </span>
            </div>
            <br />
            <div>{blogForm()}</div>
            <div>
              {blogs.map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  addLikes={handleAddLikes}
                  deleteBlog={handleDeleteBlog}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;

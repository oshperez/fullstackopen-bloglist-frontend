import React, { useState, useEffect } from "react";
import Blog from "./components/Blog.jsx";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  // Fetches blogs from database
  useEffect(() => {
    (async function () {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
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
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotification({ type: "error", message: "wrong credentials" });
    }
  };

  // Handles user logout
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    setUser(null);
  };

  // Handles new blog setup
  const handleSetupBlog = (e, property) => {
    setNewBlog((prev) => {
      const updatedBlog = { ...prev };
      updatedBlog[property] = e.target.value;
      return updatedBlog;
    });
  };

  // Handles blog creation
  const handleCreateBlog = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.create(newBlog);
      setBlogs(blogs.concat(blog));
      setNotification({
        type: "success",
        message: `a new blog ${blog.title} added`,
      });
      setNewBlog({ title: "", author: "", url: "" });
    } catch (exception) {
      setNotification({ type: "error", message: "something went wrong" });
    }
  };

  return (
    <div className="container">
      {notification && <Notification notification={notification} />}
      <div className="app">
        {!user ? (
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            login={handleLogin}
          />
        ) : null}
        {user ? (
          <div>
            <h2>blogs</h2>
            {user && (
              <span>
                {`${user.name} logged in`}
                <button onClick={handleLogout}>logout</button>
              </span>
            )}
            <br />
            <br />
            <BlogForm
              blog={newBlog}
              setupBlog={handleSetupBlog}
              createBlog={handleCreateBlog}
            />
            <br />
            <br />
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;

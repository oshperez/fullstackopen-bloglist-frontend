import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  let component;
  const createBlog = jest.fn();

  beforeEach(() => {
    component = render(<BlogForm createBlog={createBlog} />);
  });

  test(`Form calls createBlog with the right details when onsubmit event fires`, () => {
    const blog = {
      title: "Testing React forms with Jest",
      author: "Keving Louis",
      url: "dev.com/testing-react-forms-with-jest",
    };

    const form = component.container.querySelector("form");
    const title = component.container.querySelector("#title");
    const author = component.container.querySelector("#author");
    const url = component.container.querySelector("#url");

    fireEvent.change(title, {
      target: { value: blog.title },
    });

    fireEvent.change(author, {
      target: { value: blog.author },
    });

    fireEvent.change(url, {
      target: { value: blog.url },
    });

    fireEvent.submit(form);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe(blog.title);
    expect(createBlog.mock.calls[0][0].author).toBe(blog.author);
    expect(createBlog.mock.calls[0][0].url).toBe(blog.url);
  });
});

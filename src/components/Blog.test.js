import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
  let component;
  const addLikes = jest.fn();
  const deleteBlog = jest.fn();

  beforeEach(() => {
    const blog = {
      title: "Testing React components",
      author: "Leonard Simpson",
      url: "reactnotion.com/testing-react-components",
      likes: 99,
    };

    component = render(
      <Blog blog={blog} addLikes={addLikes} deleteBlog={deleteBlog} />
    );
  });

  test(`blog component renders blog's title and author but does not render 
        url or number of likes by default`, () => {
    const div = component.container.querySelector(".blog");

    expect(div).toHaveTextContent(
      "Testing React components by Leonard Simpson"
    );
    expect(div).not.toHaveTextContent(
      "reactnotion.com/testing-react-components likes 99"
    );
  });

  test(`blog's url and number of likes are shown when button controlling the 
        shown details has benn clicked`, () => {
    const button = component.getByText("view");
    fireEvent.click(button);

    expect(component.container).toHaveTextContent(
      "reactnotion.com/testing-react-componentslikes99"
    );
  });

  test(`if like button is clicked N times the event handler that is attached to 
        onclick event is called N times`, () => {
    const timesPressed = Math.floor(Math.random() * 11);

    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);

    const likeButton = component.getByText("like");

    for (let i = 0; i < timesPressed; i++) {
      fireEvent.click(likeButton);
    }

    expect(addLikes.mock.calls).toHaveLength(timesPressed);
  });
});

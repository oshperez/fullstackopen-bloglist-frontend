import React, { useState, useImperativeHandle } from "react";

import "./Togglable.css";

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({ toggleVisibility }));
  return (
    <div>
      <div className={visible ? "button--hidden" : ""}>
        <button onClick={() => toggleVisibility()}>{props.buttonLabel}</button>
      </div>
      <div className={!visible ? "wrapper--hidden" : ""}>
        {props.children}
        <button onClick={() => toggleVisibility()}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;

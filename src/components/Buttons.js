import React from "react";

const Buttons = ({ dotIndex, id,transitionTo }) => {
  return (
    <div>
      <button
        className={dotIndex === id ? "dots active" : "dots"}
        onClick={() => {
          transitionTo(id, 1);
        }}
      ></button>
    </div>
  );
};

export default Buttons;

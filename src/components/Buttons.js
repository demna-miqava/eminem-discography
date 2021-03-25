import React from "react";

const Buttons = ({ currentIndex, id,transitionTo }) => {
  return (
    <div>
      <button
        className={currentIndex === id ? "dots active" : "dots"}
        onClick={() => {
          transitionTo(id, 1);
        }}
      ></button>
    </div>
  );
};

export default Buttons;

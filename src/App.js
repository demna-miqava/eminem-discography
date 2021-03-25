import React from "react";
import "App.css";
import AlbumSliders from "./components/AlbumSliders";
import AlbumSlider from "./components/AlbumSlider";
import { loopedElements, sliderData } from "./data/SliderData";

const App = () => {
  return (
    <div>
      <AlbumSliders loopedElements={loopedElements} slides={sliderData}>
        {sliderData.map((slide) => {
          const {id}=slide;
          return <AlbumSlider key={id} slide={slide} />;
        })}
      </AlbumSliders>
    </div>
  );
};

export default App;

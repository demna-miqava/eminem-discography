import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import { loopedElements, sliderData } from "./sliderData";
import { GiCircle } from "react-icons/gi";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
function App() {
  const [state, setState] = useState({
    slides: sliderData,
    currentIndex: 1,
    movement: 0,
    lastTouch: 0,
    transitionDuration: "0s",
    transitionTimeout: 0,
  });
  const [width, setWidth] = useState(0);

  const swiperRef = useCallback((swiperElem) => {
    if (swiperElem !== null) {
      new ResizeObserver((elements) => {
        const swiperDiv = elements[0];
        const swiperDivWidth = swiperDiv.contentRect.width;
        if (width !== swiperDivWidth) {
          setWidth(swiperDivWidth);
        }
      }).observe(swiperElem);
    }
  });
  const SLIDE_WIDTH = width;
  const handleTouchStart = (e) => {
    setState((prevState) => ({
      ...prevState,
      lastTouch: e.nativeEvent.touches[0].clientX,
    }));
  };
  const handleTouchMove = (e) => {
    const delta = state.lastTouch - e.nativeEvent.touches[0].clientX;
    setState((prevState) => ({
      ...prevState,
      lastTouch: e.nativeEvent.touches[0].clientX,
    }));
    handleMovement(delta);
  };
  const handleTouchEnd = () => {
    handleMovementEnd();
    setState((prevState) => ({ ...prevState, lastTouch: 0 }));
  };
  const handleMovement = (delta) => {
    clearTimeout(state.transitionTimeout);
    setState((prevState) => {
      const maxLength = prevState.slides.length - 1;
      let nextMovement = prevState.movement + delta;
      if (nextMovement < 0) {
        nextMovement = maxLength * SLIDE_WIDTH;
      }
      if (nextMovement > maxLength * SLIDE_WIDTH) {
        nextMovement = 0;
      }
      return { ...prevState, movement: nextMovement };
    });

    setState((prevState) => ({ ...prevState, transitionDuration: "0s" }));
  };

  const handleMovementEnd = () => {
    const endPosition = state.movement / SLIDE_WIDTH;
    const endPartial = endPosition % 1;
    const endingIndex = endPosition - endPartial;
    const deltaInteger = endingIndex - state.currentIndex;

    let nextIndex = endingIndex;
    if (deltaInteger >= 0) {
      if (endPartial >= 0.5) {
        nextIndex += 1;
      }
    } else if (deltaInteger < 0) {
      nextIndex = state.currentIndex - Math.abs(deltaInteger);
      if (endPartial > 0.5) {
        nextIndex += 1;
      }
    }

    transitionTo(nextIndex, Math.min(0.5, 1 - Math.abs(endPartial)));
  };
  const transitionTo = (index, duration) => {
    setState({
      ...state,
      currentIndex: index,
      transitionDuration: `${duration}s`,
      movement: index * SLIDE_WIDTH,
      transitionTimeout: setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          transitionDuration: "0s",
        }));
      }, duration * 100),
    });
    setTimeout(() => {
      loopedElements.forEach((le) => {
        if (le.loopedId === index) {
          setState({
            ...state,
            currentIndex: le.sourceId,
            movement: le.sourceId * SLIDE_WIDTH,
            transitionDuration: "0s",
          });
        }
      });
    }, 1000);
  };
  useEffect(() => {
    clearTimeout(state.transitionTimeout);
  }, []);

  useEffect(() => {
    setState({ ...state, movement: SLIDE_WIDTH });
  }, [SLIDE_WIDTH]);

  return (
    <div className="App">
      <div
        className="main"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="swiper"
          ref={swiperRef}
          style={{
            transform: `translateX(${state.movement * -1}px)`,
            transitionDuration: state.transitionDuration,
          }}
        >
          {state.slides.map((img) => {
            const { image, id, release, name, tracklist, listen } = img;
            return (
              <div className="slide" key={id}>
                <img
                  src={image}
                  alt=""
                  onDragStart={(e) => e.preventDefault()}
                />
                <div className="content">
                  <div className="info">
                    <h3>Release Date: {release}</h3>
                  </div>
                  <div className="info">
                    <h3>Name: {name}</h3>
                  </div>
                  <div className="info">
                    <h3>
                      Check Lyrics On{" "}
                      <a href={tracklist} target="_blank" className="genius">
                        Genius
                      </a>
                    </h3>
                  </div>
                  <div className="info">
                    <h3>
                      Listen On{" "}
                      <a href={listen} target="_blank" className="spotify">
                        Spotify
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="back move"
          onClick={() => {
            transitionTo(state.currentIndex - 1, 1);
          }}
        >
          <BsArrowLeft />
        </button>
        <button
          className="next move"
          onClick={() => {
            transitionTo(state.currentIndex + 1, 1);
          }}
        >
          <BsArrowRight />
        </button>
      </div>{" "}
      <div className="dot-container">
        {state.slides.slice(1, state.slides.length - 1).map((img, dotIndex) => {
          const { id } = img;

          return (
            <div key={dotIndex}>
              <GiCircle
                className={state.currentIndex === id ? "dots active" : "dots"}
                onClick={() => {
                  transitionTo(id, 1);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useCallback, useRef } from "react";
import Buttons from "./Buttons";
import "../App.css";

const AlbumSliders = ({ loopedElements, slides, children }) => {
  const [state, setState] = useState({
    currentIndex: 1,
    dotIndex: 1,
    movement: 0,
    lastTouch: 0,
    transitionDuration: "0s",
    transitionTimeout: 0,
    isGrabbing: false,
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
  const mainRef = useRef(null);
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
      const maxLength = slides.length - 1;
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
    let dotsIndex = index;
    for (let slide of loopedElements) {
      if (slide.loopedId === index) {
        dotsIndex = slide.sourceId;
      }
    }
    setState({
      ...state,
      currentIndex: index,
      dotIndex: dotsIndex,
      transitionDuration: `${duration}s`,
      movement: index * SLIDE_WIDTH,
      transitionTimeout: setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          transitionDuration: "0s",
          transitionTimeout: null,
        }));
      }, duration * 1000),
    });
    setTimeout(() => {
      for (let slide of loopedElements) {
        if (slide.loopedId === index) {
          setState((prevState) => ({
            ...prevState,
            currentIndex: slide.sourceId,
            movement: slide.sourceId * SLIDE_WIDTH,
          }));
        }
      }
    }, 1000);
  };
  useEffect(() => {
    clearTimeout(state.transitionTimeout);
  }, []);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      movement: SLIDE_WIDTH * prevState.currentIndex,
    }));
  }, [SLIDE_WIDTH]);

  //Mouse action handlers
  const handleMouseDown = (e) => {
    setState((prevState) => ({
      ...prevState,
      lastTouch: e.pageX,
      isGrabbing: true,
    }));
    mainRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!state.isGrabbing) return;
    const delta = state.lastTouch - e.pageX;
    setState((prevState) => ({
      ...prevState,
      lastTouch: e.pageX,
    }));
    handleMovement(delta);
  };

  const handleMouseLeave = () => {
    if (!state.isGrabbing) return;
    handleMovementEnd();
    setState((prevState) => ({
      ...prevState,
      lastTouch: 0,
      isGrabbing: false,
    }));
    mainRef.current.style.cursor = "grab";
  };
  return (
    <div className="App">
      <div
        className="main"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseLeave}
        ref={mainRef}
      >
        <div
          className="swiper"
          ref={swiperRef}
          style={{
            transform: `translateX(${state.movement * -1}px)`,
            transitionDuration: state.transitionDuration,
          }}
        >
          {children}
        </div>
        <button
          className="back move"
          onClick={() => {
            transitionTo(state.currentIndex - 1, 1);
          }}
        >
          ←
        </button>
        <button
          className="next move"
          onClick={() => {
            transitionTo(state.currentIndex + 1, 1);
          }}
        >
          →
        </button>
      </div>{" "}
      <div className="dot-container">
        {slides.slice(1, slides.length - 1).map((img, dotIndex) => {
          const { id } = img;
          return (
            <Buttons
              dotIndex={state.dotIndex}
              id={id}
              key={id}
              transitionTo={transitionTo}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AlbumSliders;

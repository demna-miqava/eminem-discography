import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import { loopedElements, sliderData } from "./sliderData";
import { GiCircle } from "react-icons/gi";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";

const ImageSlider = () => {
  const [state, setState] = useState({
    imgs: sliderData,
    currentIndex: 1,
    movement: 0,
    lastTouch: 0,
    transitionDuration: "0s",
    transitionTimeout: 0,
  });
  const [width, setWidth] = useState(0);

  const swiperRef = useCallback((swiperElement) => {
    if (swiperElement !== null) {
      new ResizeObserver((elements) => {
        const swiperDiv = elements[0];
        const swiperDivWidth = swiperDiv.contentRect.width;
        if (width !== swiperDivWidth) {
          setWidth(swiperDivWidth);
        }
      }).observe(swiperElement);
    }
  });
  const IMG_WIDTH = width;
  // const handleWheel = (e) => {
  //   handleMovement(e.deltaX);
  //   const wheelTimeout = setTimeout(() => handleMovementEnd(), 100);
  //   clearTimeout(wheelTimeout);
  // };
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
      const maxLength = prevState.imgs.length - 1;
      let nextMovement = prevState.movement + delta;
      if (nextMovement < 0) {
        nextMovement = maxLength * IMG_WIDTH;
      }
      if (nextMovement > maxLength * IMG_WIDTH) {
        nextMovement = 0;
      }
      return { ...prevState, movement: nextMovement };
    });

    setState((prevState) => ({ ...prevState, transitionDuration: "0s" }));
  };

  const handleMovementEnd = () => {
    const endPosition = state.movement / IMG_WIDTH;
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
    // setCurrentIndex(index);
    // setTransitionDuration(`${duration}s`);
    // setMovement(index * IMG_WIDTH);
    // setTransitionTimeout(
    //   setTimeout(() => {
    //     setTransitionDuration(0);
    //   }, duration * 100)
    // ); //?
    setState({
      ...state,
      currentIndex: index,
      transitionDuration: `${duration}s`,
      movement: index * IMG_WIDTH,
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
            index: le.sourceId,
            movement: le.sourceId * IMG_WIDTH,
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
    setState({ ...state, movement: IMG_WIDTH });
  }, [IMG_WIDTH]);

  return (
    <div>
      <div className="App">
        <div
          className="main"
          // onWheel={handleWheel}
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
            {state.imgs.map((img) => {
              const { image, id, year, name } = img;
              return (
                <img
                  src={image}
                  key={id}
                  alt=""
                  onDragStart={(e) => e.preventDefault()}
                />
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
        <div className="abg">
          {state.imgs.slice(1, state.imgs.length - 1).map((img, dotIndex) => {
            const { id } = img;

            return (
              <div key={dotIndex}>
                <GiCircle
                  className={state.currentIndex === id ? "dots grey" : "dots"}
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
    </div>
  );
};

export default ImageSlider;


import React from "react";

const AlbumSlider = ({ slide }) => {
  const { image, id, release, name, tracklist, listen } = slide;
  return (
    <div className="slide">
      <img src={image} alt="" onDragStart={(e) => e.preventDefault()} />
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
};

export default AlbumSlider;

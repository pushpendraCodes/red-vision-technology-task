import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import { Carousel } from "react-responsive-carousel";
export default function Crousal() {
  return (
    <div className="">
      <Carousel showArrows={true} dynamicHeight={true} showThumbs={false} showStatus={false} showIndicators={false} autoPlay={true} infiniteLoop={true} >
        <div>
          <img src="banner4.jpg" />
          {/* <p className="legend">Legend 1</p> */}
        </div>
        <div>
          <img src="banner5.jpg" />
          {/* <p className="legend">Legend 2</p> */}
        </div>
        <div>
          <img src="banner6.jpg" />
          {/* <p className="legend">Legend 3</p> */}
        </div>
        <div>
          <img src="banner7.jpg" />
          {/* <p className="legend">Legend 3</p> */}
        </div>
      </Carousel>
    </div>
  );
}

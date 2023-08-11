import { Carousel } from "@mantine/carousel";
import Image from "next/image";
import React from "react";

const Slideshow = () => {
  return (
    <>
      <Carousel
        // maw={620}
        mx="auto"
        withIndicators
        // height={200}
        slideSize="70%"
        slideGap="md"
        controlsOffset="md"
        loop
        dragFree
      >
        <Carousel.Slide>
          <img
            src="/img1.jpg"
            style={{ width: "100%" }}
            alt="No Image"
            srcset=""
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <img
            src="/img2.jpg"
            style={{ width: "100%" }}
            alt="No Image"
            srcset=""
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <img
            src="/img3.jpg"
            style={{ width: "100%" }}
            alt="No Image"
            srcset=""
          />
        </Carousel.Slide>
        {/* ...other slides */}
      </Carousel>
    </>
  );
};

export default Slideshow;

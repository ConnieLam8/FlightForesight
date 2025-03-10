import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import cancunInfo from '../../images/cancun_no_info.jpg';
import floridaInfo from '../../images/maimi.png';
import losAngelesInfo from '../../images/losangeles.png';
import vancouverInfo from '../../images/vancouver.png';
import newyorkInfo from '../../images/newyork.png';

const cards = [
  {
    id: 1,
    title: "Cancun, Mexico",
    image: cancunInfo,
    distance: "4h 20m",
    flightDate: "April 12 - April 13",
    price: "$599",
  },
  {
    id: 2,
    title: "Miami, Florida",
    image: floridaInfo,
    distance: "5h 24m",
    flightDate: "April 7 - April 8",
    price: "$320",
  },
  {
    id: 3,
    title: "Los Angeles, California",
    image: losAngelesInfo,
    distance: "6h 11m",
    flightDate: "April 6 - April 6",
    price: "$430",
  },
  {
    id: 4,
    title: "Vancouver, BC",
    image: vancouverInfo,
    distance: "3h 14m",
    flightDate: "April 5 - April 5",
    price: "$499",
  },
  {
    id: 5,
    title: "New York",
    image: newyorkInfo,
    distance: "1h 59m",
    flightDate: "June 20, 2025",
    price: "$110",
  },
];

const Carousel = () => {
  return (
    <div className="carousel-container">
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        navigation
        loop
        breakpoints={{
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        }}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id}>
            <div className="card">
              <img src={card.image} alt={card.title} />
              <h3>{card.title}</h3>
              <div className="info-box">
                <p>{card.distance}</p>
                <p>{card.flightDate}</p>
                <p className="price"><strong>Starting at</strong> {card.price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
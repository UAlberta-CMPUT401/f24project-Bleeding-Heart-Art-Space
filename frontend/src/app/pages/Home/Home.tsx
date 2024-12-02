import React from "react";
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel CSS
import './Home.module.css';
import Photo1 from '@assets/Photo1.jpeg';
import Photo2 from '@assets/Photo2.jpg';
import Photo3 from '@assets/Photo3.jpeg';
import Photo4 from '@assets/Photo4.jpg';

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>

      <h2>Volunteer Management App</h2>

      {/* Photo Carousel */}
      <div style={{ marginTop: '20px' , marginBottom: '20px'}}>
      <Carousel
          showArrows={false}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          interval={3000}
          transitionTime={1000}
          emulateTouch={true}
          centerMode={true}
          centerSlidePercentage={70}
        >
          <div className="carousel-image-container">
            <img src={Photo1} alt="Photo 1" className="carousel-image" />
          </div>
          <div className="carousel-image-container">
            <img src={Photo2} alt="Photo 2" className="carousel-image" />
          </div>
          <div className="carousel-image-container">
            <img src={Photo3} alt="Photo 3" className="carousel-image" />
          </div>
          <div className="carousel-image-container">
            <img src={Photo4} alt="Photo 4" className="carousel-image" />
          </div>
        </Carousel>
      </div>

      <Button 
        component={Link}
        variant="contained"
        to="/login"
      >
        Login
      </Button>
    </div>
  );
}

export default Home;

import React from "react";
import { Container } from "react-bootstrap";

function AboutUs() {
  return (
    <div className="header">
      <div className="bg"></div>
      <Container fluid className="cont">
        <div className="header__box">
          <h1 className="h2 mb-5">About us</h1>
          <p className="p">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
      </Container>
    </div>
  );
}

export default AboutUs;

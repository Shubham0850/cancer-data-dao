import React from "react";
import { Container } from "react-bootstrap";

function UseData() {
  return (
    <div className="header">
      <div className="bg"></div>
      <Container fluid className="cont">
        <div className="header__box">
          <h1 className="h2 mb-5">Use Data</h1>
          <p className="p">list of hospitals</p>
        </div>
      </Container>
    </div>
  );
}

export default UseData;

import Link from "next/link";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Header() {
  return (
    <div className="header">
      <div className="bg"></div>
      <Container fluid className="cont">
        <div className="header__container">
          <Row className="header__row">
            <Col sm={12} md={6} className="header__col">
              <div>
                <h1 className="h1">Cancer<br/> Data DAO</h1>
                <p className="p mb-5">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                </p>
                <Row>
                  <Col>
                    <Link href="/upload-data">
                      <button className="btns">Donate Data</button>
                    </Link>
                    <Link href="use-data">
                      <button className="btns btns--border ml-3">Lend Data</button>
                    </Link>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col sm={12} md={6} className="header__col sm-mb-5">
              <img src="https://www.pngkey.com/png/full/407-4079860_cancer-cell-png-cancer-cell-no-background.png" alt="header"/>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

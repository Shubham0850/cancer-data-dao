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
                <h1 className="h1">Cure DA💿</h1>
                <p className="p mb-5">
                Cure dao aggregates sensitive medical data from hospitals, encrypts it, and uploads it to filecoin network. Approved universities and research centers will be able to access data for a fee. On-chain access control and encryption are enabled by leveraging the Medusa contract. #FVM
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
              <img src="/cell.png" alt="header"/>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

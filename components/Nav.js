import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Nav() {
  const router = useRouter();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    setVisible(
      (prevScrollPos > currentScrollPos &&
        prevScrollPos - currentScrollPos > 70) ||
        currentScrollPos < 10
    );

    setPrevScrollPos(currentScrollPos);
  };

  // new useEffect:
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`nav ${visible && `nav-blured-bg`}`}>
      <Container fluid className="cont">
        <Row className="nav__row">
          <Col md={3} className="nav__logo">
            <Link href="/">
              {/* <img src="https://www.pngkey.com/png/full/407-4079860_cancer-cell-png-cancer-cell-no-background.png" alt="logo" /> */}
              <h3 className="h3">🧬cancerData DA💿</h3>
            </Link>
          </Col>
          <Col sm={0} md={6} className="nav__links hide-on-phone">
            <span className="nav__link">
              <Link href="/roadmap">Roadmap</Link>
            </span>

            <span className="nav__link">
              <Link href="/about-us">About Us</Link>
            </span>

            <span className="nav__link">
              <Link href="/upload-data">Data Donation</Link>
            </span>

          </Col>

          <Col md={3} className="nav__cta">
           
              <button className="btns" >
                Connect wallet
              </button>
        
          </Col>
        </Row>
      </Container>
    </div>
  );
}

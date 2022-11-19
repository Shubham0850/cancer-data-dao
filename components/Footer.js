import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

export default function Footer() {
  return (
    <div>
      <div className="grad-border"></div>
      <div className="footer">
        <Container fluid className="cont">
          <Row>
            <Col md={2} className="sm-mb-5">
              <img src="https://www.pngkey.com/png/full/407-4079860_cancer-cell-png-cancer-cell-no-background.png" alt="logo" className="footer__logo mb-3" />
              
             
            </Col>
            <Col md={10}><p className="p mb-3">
                {`detail of the project`}
              </p></Col>


          </Row>
        </Container>
        <p className="footer__cright p text-center p-3">
          © All Right is reserved by us. Design and Developed by{" "}
          <a href="http://shubhamraj.live/" rel="noreferrer" target="_blank">
            Link
          </a>
        </p>
      </div>
    </div>
  );
}

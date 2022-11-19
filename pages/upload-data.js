import React, { useState } from "react";
import { Container } from "react-bootstrap";

export default function UploadData() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    // submit data
    console.log(selectedFile)
  };

  return (
    <div className="header">
      <div className="bg"></div>
      <Container fluid className="cont">
        <div className="header__box">
          <h1 className="h2 mb-5">Donate Data</h1>
          <p className="p">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>

          <input type="file" placeholder="select cancer data file" onChange={changeHandler} />
          <button className="btns" onClick={handleSubmission}>Upload</button>
        </div>
      </Container>
    </div>
  );
}

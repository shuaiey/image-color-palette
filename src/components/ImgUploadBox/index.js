import React, { useState, useRef } from "react";
import IconUpload from "./iconUpload";

const ImgUploadBox = React.forwardRef((props, userImgRef) => {
  const uploadRef = useRef(null);
  const dropzoneRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [height, setHeight] = useState(0);

  const dragEnterHandler = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragOverHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    dropzoneRef.current.classList.add("is-dragover");
  };

  const dragLeaveHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    dropzoneRef.current.classList.remove("is-dragover");
  };

  const dropHandler = e => {
    e.preventDefault();
    var data = e.dataTransfer.items;
    if (!data || data.length < 1) return;
    if (data.length > 1) return window.alert("Please only drop one file");
    if (data[0].kind === "file" && data[0].type.match("^image/")) {
      var file = data[0].getAsFile();
      showImage(file);
    } else {
      window.alert("Please use a image file ;)");
    }
    dropzoneRef.current.classList.remove("is-dragover");
  };

  const showImage = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // Async loading
    reader.onload = function() {
      var image = new Image();
      image.src = this.result;
      image.onload = function() {
        userImgRef.current.src = this.src;
        setIsLoaded(true);
        setHeight(userImgRef.current.height);
      };
    };
  };

  const handleUploadClick = () => {
    uploadRef.current.click();
  };

  const handleUploadChange = () => {
    let file = uploadRef.current.files[0];
    if (!file) return false;
    if (!/image\//.test(file.type)) {
      console.log("This file is not image, please upload an image file.");
      return false;
    }
    showImage(file);
  };

  return (
    <div className="imgUploadBox">
      <div
        id="drop-zone"
        ref={dropzoneRef}
        onDragEnter={dragEnterHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
        onDrop={dropHandler}
        onClick={handleUploadClick}
        style={{
          height: height ? height + "px" : "350px"
        }}
      >
        <div className="box-input">
          <input
            className="input-img-upload"
            type="file"
            id="input"
            ref={uploadRef}
            onChange={handleUploadChange}
          ></input>
        </div>
        <div
          className="box-sample"
          style={isLoaded ? { visibility: "hidden" } : {}}
        >
          <IconUpload />
          <label className="box-label">
            Drag one picture to this Drop Zone ...
          </label>
        </div>
        <div className={isLoaded ? "box-user box-user-active" : "box-user"}>
          <img src="/" alt="" ref={userImgRef} />
        </div>
        <div className="drag-overlay"></div>
      </div>

      <style jsx="true">
        {`
          .imgUploadBox {
            margin-bottom: 3rem;
          }
          #drop-zone {
            width: 580px;
            border: 1px solid black;
            outline: 1px dashed #000;
            outline-offset: -10px;
            position: relative;
            height: 350px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px auto;
            -webkit-transition: outline-offset 0.15s ease-in-out,
              background-color 0.15s linear;
            transition: outline-offset 0.15s ease-in-out,
              background-color 0.15s linear;
          }
          .box-icon {
            width: 100%;
            height: 80px;
            fill: #7a7a8c;
            display: block;
            margin-bottom: 40px;
          }
          .box-label {
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            display: block;
            text-align: center;
            overflow: hidden;
          }
          #drop-zone.is-dragover {
            outline: 2px dashed #92b0b3;
            outline-offset: 0px;
            background-color: #fff;
          }
          .box-user {
            position: absolute;
            width: 100%;
            top: 0;
            z-index: 2;
          }
          .box-user img {
            width: 580px;
          }
          .box-user-active {
          }
        `}
      </style>
    </div>
  );
});

export default ImgUploadBox;

import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Image } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SucessRight from "../../assets/images/SucessRight.svg";
import DltIcon from "../../assets/images/delete.svg";
import "./DropFileInput.css"
import uploadIcon from "../../assets/images/uploadIcon.svg";
import { Link } from 'react-router-dom'

import 'react-dropzone-uploader/dist/styles.css';

const DropFileInput = (props) => {
  const MySwal = withReactContent(Swal);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState(false);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
      if (newFile) {
        setFileError(false);
        props.setError((prev) => ({ ...prev, ["File"]: "" }));
        const updatedList = [...props?.fileList, newFile];
        props.onFileChange(updatedList);
      }
  };

  const fileRemove = (file) => {
    props.setError((prev) => ({ ...prev, ["File"]: "" }));
    setFileError(false);
    const updatedList = [...props?.fileList];
    updatedList.splice(props?.fileList.indexOf(file), 1);
    props.onFileChange(updatedList);
    // }
  };

  // const downloadFile = (filename) => {
  //   if (!props.fileChanged) {
  //     downloadAttachment(filename).catch((err) => {
  //       console.error("Error in Fetching file.", err);
  //       MySwal.fire("Error!", "Error in Fetching file.", "error");
  //     });
  //   }
  // };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };
  return (
    <div className="upload-box">
      {!props.readOnly && (
        <div>
          <span className="attach-note-color2">
            Only 1 attachment is allowed to upload and format should be .jpeg, .png formats file with max limit of 5 MB
          </span>

          <div
            ref={wrapperRef}
            className="drop-file-input"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {props?.fileList?.length <= 0 && (

              <div
                className={fileError ? "text-label-with-error" + " drop-file-input__label" : "drop-file-input__label"}>
                <Image src={uploadIcon}
                  alt="Upload"
                  className='upload-btn'
                />
                <span>  Drag & Drop your files here or </span>
                {/* <span className="browse-files-text"> <Link>Browse Files</Link> </span> */}
                <span className="browse-files-text"> <Link onClick={handleUploadClick} >{props?.fileList?.length > 0 ? `${props?.fileList[0].name}` : 'Browse Files'}</Link> </span>

                <input
                  type="file"
                  value=""
                  title="Select or Drag Files here"
                  onChange={onFileDrop}
                  ref={inputRef}
                  style={{ display: 'none' }}
                >
                </input>
              </div>
            )}
            {props?.fileList?.length > 0 && (
              <div className="drop-file-input__label">
                {props?.fileList.map((item, index) => {
                  let filename = item.name;

                  return (
                    <div className="files-list-map" key={index}>
                      <Link
                        className="files-note cursor-pointer wrap-word"
                        // onClick={(e) => {
                          // downloadFile(props.folderPath + filename);
                        // }}
                      >
                        {filename}
                      </Link>

                      <img src={DltIcon} onClick={() => fileRemove(item)} className='attachment-remove' />
                      <img src={SucessRight} className='success-right' />
                      <span className='success-right' >100%</span> &nbsp;

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;

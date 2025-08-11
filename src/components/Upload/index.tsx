/* eslint-disable */
import { Upload, notification } from "antd";
import { IFile } from "../../constants/database";
import type { RcFile, UploadProps, UploadFile } from "antd/es/upload/interface";
import axios from "axios";
import { ReactComponent as UploadIcon } from "../../icons/uploadCloud.svg";
import styles from "./index.module.scss";
import { useMemo, useState, useEffect } from "react";

interface IUploadComponent {
  handleUploadUrl: (file: IFile) => void;
  files?: IFile;
  isMultiple: boolean;
}

const MAX_FILE_SIZE_FOR_UPLOAD = 1024 * 20;

const UploadComponent = ({
  handleUploadUrl,
  isMultiple,
  files,
}: IUploadComponent) => {
  const { Dragger } = Upload;
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (files) {
      setFileList([
        {
          uid: files._id || "-1",
          name: files.fileUrl.split("/").pop() || "file",
          status: "done",
          url: files.fileUrl,
          type: files.fileType,
          size: files.fileSize,
        },
      ]);
    }
  }, [files]);

  const handleCustomRequest = async ({
    file,
    onProgress,
    onSuccess,
    onError,
  }: any) => {
    const formData = new FormData();
    formData.append("files", file, `${file.name}`);

    try {
      const response = await axios.post(
        `https://qualified-regina-bluestar-timbr-5ecda5aa.koyeb.app/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              onProgress({ percent });
            }
          },
        }
      );
      onSuccess(response.data); // Handle successful response
      console.log(response.data.files[0], "Response");

      handleUploadUrl({
        fileSize: response.data.files[0]?.data?.fileSize,
        fileType: response.data.files[0]?.data?.fileType,
        fileUrl: response.data.files[0]?.data?.file,
      });
    } catch (error) {
      onError(error);
      console.error(`${file.name} file upload failed`);
    }
  };

  const handleChange = (info: any) => {
    let newFileList = [...info.fileList];

    if (!isMultiple) {
      newFileList = newFileList.slice(-1);
    }

    setFileList(newFileList);
  };

  const props: UploadProps = {
    name: "file",
    multiple: isMultiple,
    accept: ".png,.jpeg,.doc,.pdf",
    fileList: fileList,
    onChange: handleChange,
    customRequest: handleCustomRequest,
    beforeUpload: (file) => {
      const sizeInKbs = file.size / 1024;

      if (sizeInKbs > MAX_FILE_SIZE_FOR_UPLOAD) {
        console.error("Size can't be greater than 20 megabytes");
        return false;
      }
      return true;
    },
  };

  return (
    <Dragger {...props} className="custom-upload">
      <div className={styles.uploadIconContainer}>
        <div className={styles.uploadIcon}>
          <UploadIcon />
        </div>
      </div>
      <div className={styles.uploadText}>
        <p>Click to upload</p> or drag and drop
      </div>
      <p className={styles.uploadSubtext}>JPG, PNG, DOC or PDF (max. 20MB)</p>
    </Dragger>
  );
};

export default UploadComponent;

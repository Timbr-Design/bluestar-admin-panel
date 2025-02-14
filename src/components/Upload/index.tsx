/* eslint-disable */
import { Upload, notification } from "antd";
import { IFile } from "../../constants/database";
import type { RcFile, UploadProps, UploadFile } from "antd/es/upload/interface";
import apiClient from "../../utils/configureAxios";
import axios from "axios";
import { ReactComponent as UploadIcon } from "../../icons/uploadCloud.svg";
import styles from "./index.module.scss";
import { useMemo } from "react";

interface IUploadComponent {
  handleUploadUrl: (file: IFile) => void;
  files?: IFile[];
  isMultiple: boolean;
}

const MAX_FILE_SIZE_FOR_UPLOAD = 1024 * 20;

const UploadComponent = ({
  handleUploadUrl,
  isMultiple,
  files,
}: IUploadComponent) => {
  const { Dragger } = Upload;

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
      handleUploadUrl(response.data.files[0]);
    } catch (error) {
      onError(error);
      console.error(`${file.name} file upload failed`);
    }
  };

  const defaultFileList: UploadFile[] = useMemo(() => {
    return (
      files?.map((file, index) => ({
        uid: `${index}`,
        name: `doc-${index}`, // File name
        status: "done", // File status (done, uploading, error)
        url: file.fileUrl, // URL if file is already uploaded
      })) || []
    );
  }, [files]);

  const props: UploadProps = {
    name: "file",
    multiple: isMultiple,
    accept: ".png,.jpeg,.doc,.pdf",
    customRequest: handleCustomRequest,
    beforeUpload: (file) => {
      const sizeInKbs = file.size / 1024;

      if (sizeInKbs > MAX_FILE_SIZE_FOR_UPLOAD) {
        console.error("Size can't be greater than 20 megabytes");
        return false;
      }
      return true;
    },
    defaultFileList,
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

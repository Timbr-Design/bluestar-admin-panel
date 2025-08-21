"use client";

import { useState } from "react";
import { Select, Input, Button, Typography, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./Taxable.module.scss";
import { ReactComponent as DeleteIcon } from "../../../icons/trash.svg";
import UploadComponent from "../../Upload";
import { IFile } from "../../../constants/database";

const { Title, Text } = Typography;

export default function Taxable() {
  const [fileList, setFileList] = useState<IFile[]>([]);
  const [customRows, setCustomRows] = useState([
    { id: "1", type: "taxable", amount: "" },
  ]);

  // const removeFile = (uid: string) => {
  //   setFileList((files) => files.filter((file) => file._id !== uid));
  // };

  const handleUploadUrl = (file: IFile) => {
    const tempFilesArr = [...fileList, file];
    setFileList(tempFilesArr);
  };

  // const uploadProps = {
  //   name: "file",
  //   multiple: true,
  //   showUploadList: false,
  //   beforeUpload: () => false,
  // };

  const addCustomRow = () => {
    const newRow = {
      id: Date.now().toString(),
      type: "taxable",
      amount: "",
    };
    setCustomRows([...customRows, newRow]);
  };

  const removeCustomRow = (id: string) => {
    if (customRows.length > 1) {
      setCustomRows(customRows.filter((row) => row.id !== id));
    }
  };

  const updateCustomRow = (id: string, field: string, value: string) => {
    setCustomRows(
      customRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  return (
    <div className={styles.container}>
      {/* Custom row section */}
      <Card className={styles.customRowCard}>
        <Title level={3} className={styles.sectionTitle}>
          Custom row
        </Title>
        {customRows.map((row) => (
          <div key={row.id} className={styles.customRowFields}>
            <div className={styles.fieldBox}>
              <Text className={styles.fieldLabel}>Type</Text>
              <Select
                value={row.type}
                onChange={(value) => updateCustomRow(row.id, "type", value)}
                defaultValue="taxable"
                className={styles.customSelect}
              >
                <Select.Option value="taxable">Taxable</Select.Option>
                <Select.Option value="non-taxable">Non-taxable</Select.Option>
                <Select.Option value="exempt">Exempt</Select.Option>
              </Select>
            </div>

            <div className={styles.fieldBox}>
              <Text className={styles.fieldLabel}>Amount</Text>
              <Input
                prefix={<span className={styles.currencySymbol}>₹</span>}
                placeholder="Amount here"
                value={row.amount}
                className={styles.amountInput}
                onChange={(e) =>
                  updateCustomRow(row.id, "amount", e.target.value)
                }
              />
            </div>

            <div className={styles.fieldBox}>
              <div className={`${styles.fieldLabel} ${styles.invisible}`}>
                <Text>Action</Text>
              </div>

              <Button
                onClick={() => removeCustomRow(row.id)}
                icon={<DeleteIcon />}
                className={styles.deleteButton}
              />
            </div>
          </div>
        ))}

        <Button
          type="text"
          icon={<PlusOutlined />}
          className={styles.addRowButton}
          onClick={addCustomRow}
        >
          Add custom row
        </Button>
      </Card>

      {/* Tax classification section */}
      <div className={styles.taxClassificationSection}>
        <Text className={styles.fieldLabel}>
          Tax classification (Nature of transaction)
        </Text>
        <Select defaultValue="sales-taxable" className={styles.taxSelect}>
          <Select.Option value="sales-taxable">
            Sales taxable - 5%
          </Select.Option>
          <Select.Option value="sales-taxable-12">
            Sales taxable - 12%
          </Select.Option>
          <Select.Option value="sales-taxable-18">
            Sales taxable - 18%
          </Select.Option>
          <Select.Option value="sales-exempt">Sales exempt</Select.Option>
        </Select>
      </div>

      {/* Invoice attachments section */}
      <div className={styles.attachmentsSection}>
        <Text className={styles.fieldLabel}>Invoice attachments</Text>

        {/* Upload area */}
        {/* <Dragger {...uploadProps} className={styles.uploadDragger}>
          <div className={styles.uploadContent}>
            <div className={styles.uploadIconContainer}>
              <InboxOutlined className={styles.uploadIcon} />
            </div>
            <p className={styles.uploadText}>
              <span className={styles.uploadLink}>Click to upload</span>
              <span className={styles.uploadDescription}>
                {" "}
                or drag and drop
              </span>
            </p>
            <p className={styles.uploadFormats}>
              PDF, DOC, or XLSX (max. 10MB)
            </p>
          </div>
        </Dragger> */}
        <UploadComponent handleUploadUrl={handleUploadUrl} isMultiple={false} />

        {/* Uploaded files */}
        {/* <Space direction="vertical" className={styles.fileList} size={12}>
          {fileList.map((file) => (
            <Card key={file._id} className={styles.fileItem}>
              <Row align="middle" gutter={12}>
                <Col flex="none">
                  <div className={styles.fileIcon}>
                    <FilePdfOutlined />
                  </div>
                </Col>
                <Col flex="auto">
                  <Row
                    justify="space-between"
                    align="middle"
                    className={styles.fileHeader}
                  >
                    <Col>
                      <Text className={styles.fileName}>{file.name}</Text>
                    </Col>
                    <Col>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => removeFile(file._id)}
                        className={styles.fileDeleteButton}
                      />
                    </Col>
                  </Row>
                  <Text className={styles.fileSize}>{file.fileSize}</Text>
                  <Row
                    align="middle"
                    gutter={12}
                    className={styles.progressRow}
                  >
                    <Col flex="auto">
                      <Progress
                        percent={file.percent}
                        showInfo={false}
                        strokeColor="#17b26a"
                        size="small"
                        className={styles.fileProgress}
                      />
                    </Col>
                    <Col flex="none">
                      <Text className={styles.progressText}>
                        {file.percent}%
                      </Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          ))}
        </Space> */}
      </div>
    </div>
  );
}

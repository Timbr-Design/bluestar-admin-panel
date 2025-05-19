/* eslint-disable */
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  List,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Table,
} from "antd";
import styles from "./index.module.scss";
import { ReactComponent as SearchIcon } from "../../../icons/SearchIcon.svg";
import SearchComponent from "../../SearchComponent";
import { ReactComponent as InvoiceIcon } from "../../../icons/invoice.svg";
import { SearchOutlined } from "@ant-design/icons";
import CancelBtn from "../../CancelBtn";
import { useState, useEffect, ChangeEvent } from "react";
import UploadComponent from "../../Upload";
import Preview from "../Preview";
import { getCustomer } from "../../../redux/slices/databaseSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
const { TextArea } = Input;

const ReceiptForm = () => {
  const { customersOption } = useAppSelector((state) => state.database);

  useEffect(() => {
    dispatch(
      getCustomer({
        page: "1",
        limit: "10",
        search: "",
      })
    );
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (data: any) => {
        return data;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (data: any) => {
        return data;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (data: any) => {
        return data;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data: any) => {
        return data;
      },
    },
  ];
  const data = [
    {
      label: "Ant Design Title 1",
      amount: 200,
    },
    {
      label: "Ant Design Title 2",
      amount: 200,
    },
  ];
  const [value, setValue] = useState(1);
  const dispatch = useAppDispatch();
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const getCustomerList = (searchText: string) => {
    if (searchText) {
      dispatch(
        getCustomer({
          search: searchText,
        })
      );
    }
  };

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.content}>
        <div className={styles.heading}>
          <div className={styles.header}>
            <div className={styles["header_1"]}>Receipt details</div>
            <div className={styles["header_2"]}>
              Fill customer and invoice details here
            </div>
          </div>
        </div>
        <div className={styles.customerContainer}>
          <div className={styles.customerHeading}>Customer details</div>
          <Form.Item
            name="customer"
            rules={[{ required: true }]}
            label="Customer"
            layout="vertical"
          >
            <Select
              allowClear
              showSearch
              options={customersOption?.map(
                (option: { value: any; label: any }) => ({
                  value: option.value,
                  label: option.label,
                })
              )}
              onSearch={(text) => getCustomerList(text)}
              placeholder="Select customer"
              filterOption={false}
              fieldNames={{ label: "label", value: "value" }}
              notFoundContent={<div>No search result</div>}
            />
          </Form.Item>
        </div>
        <div className={styles.invoicesContainer1}>
          <Row gutter={8} align={"middle"}>
            <Col className="gutter-row">
              <InvoiceIcon />
            </Col>
            <Col className="gutter-row">
              <div className={styles.invoicesHeading}>Invoices</div>
              <div className={styles.invoicesDescription}>
                Select from the list of available invoices to add to this
                reciept
              </div>
            </Col>
          </Row>
          <Row gutter={8} align={"middle"}>
            <Col span={16}>
              <SearchComponent
                value={""}
                onChange={searchHandler}
                LeadingIcon={SearchIcon}
                placeholder={`Search by invoice number`}
                customClass={styles.searchInput}
              />
            </Col>
            <Col span={8}>
              <DatePicker
                style={{
                  padding: "0.2rem",
                }}
                onChange={() => {}}
              />
            </Col>
          </Row>

          <Table
            bordered
            // loading={}
            rowSelection={{
              onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                console.log(
                  `selectedRowKeys: ${selectedRowKeys}`,
                  "selectedRows: ",
                  selectedRows
                );
              },
              getCheckboxProps: (record: any) => ({
                // disabled: record.name === "Disabled User", // Column configuration not to be checked
                // name: record.name,
              }),
            }}
            dataSource={[
              {
                id: 123,
                date: 123,
                amount: 234,
                status: "generated",
              },
            ]}
            columns={columns}
            pagination={false}
            scroll={{ x: "max-content" }}
          />

          <Row gutter={8} align={"middle"}>
            <Col className="gutter-row">
              <Button
                style={{
                  padding: "20px 14px",
                  fontSize: "14px",
                  fontWeight: "600",
                  lineHeight: "20px",
                }}
              >
                Choose selected invoices
              </Button>
            </Col>
            <Col className="gutter-row">
              <CancelBtn onClick={() => {}} btnText="Re-select invoices" />
            </Col>
          </Row>
          {/* Invoice descriptions */}
        </div>
        <div className={styles.invoicesContainer}>
          <p>Invoice descriptions</p>
          {[1, 2].map((each) => (
            <div key={each}>
              <div className={styles.invoicNo}>Invoice #GR2425-0005</div>
              <div className={styles.invoicDate}>23/20/2025</div>
              <List
                dataSource={data}
                renderItem={(item) => (
                  <List.Item key={item.label}>
                    <p>{item.label}</p>
                    <p>{item.amount}</p>
                  </List.Item>
                )}
              />
            </div>
          ))}
          <div>Total</div>
          <small>2 invoices</small>
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.label}>
                <p>{item.label}</p>
                <p>{item.amount}</p>
              </List.Item>
            )}
          />
        </div>

        <div className={styles.invoicesContainer}>
          <p>Payment details</p>
          <div>
            <small>Payment mode</small>
            <Radio.Group
              style={{
                marginTop: "0.5rem",
              }}
              onChange={onChange}
              value={value}
            >
              {[
                { name: "Cash", value: 1 },
                { name: "Cheque", value: 2 },
                { name: "NEFT", value: 3 },
                { name: "Credit Card", value: 4 },
                { name: "Other", value: 5 },
              ].map((each) => (
                <Radio
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #E4E7EC",
                    borderRadius: "0.5rem",
                  }}
                  value={each.value}
                >
                  {each.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          <Form.Item
            name="bank"
            rules={[{ required: true }]}
            label="Recieved in bank"
            layout="vertical"
          >
            <Select
              allowClear
              showSearch
              options={[]}
              onSearch={(text) => {}}
              placeholder="Recieved in bank"
              fieldNames={{ label: "label", value: "value" }}
              notFoundContent={<div>No search result</div>}
            />
          </Form.Item>
          <Form.Item
            name="bankDate"
            rules={[{ required: true }]}
            label="Bank Credit Date"
            layout="vertical"
          >
            <DatePicker
              style={{
                width: "100%",
              }}
              onChange={() => {}}
            />
          </Form.Item>
          <UploadComponent handleUploadUrl={() => {}} isMultiple={false} />
          <Form.Item
            name="comment"
            rules={[{ required: true }]}
            label="Comment"
            layout="vertical"
          >
            <TextArea placeholder="comment" />
          </Form.Item>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.heading}>
          <div className={styles.header}>
            <div className={styles["header_1"]}>Preview</div>
            <div className={styles["header_2"]}>
              See your generated receipt here
            </div>
          </div>
        </div>
        <Preview />
      </div>
    </div>
  );
};

export default ReceiptForm;

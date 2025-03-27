/* eslint-disable */

import React from "react";
import { DatePicker as AntDatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

interface CustomDatePickerProps {
  value?: number;
  onChange?: (value?: number) => void;
  format?: string;
  disabledDate?: (current: Dayjs) => boolean;
  style?: React.CSSProperties;
  showHour?: boolean;
  showMinute?: boolean;
  showTime?: boolean;
  use12Hours?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  format = "DD-MM-YYYY hh:mm A",
  disabledDate,
  showHour = true,
  showMinute = true,
  showTime = true,
  use12Hours = true,
  ...rest
}) => {
  const handleChange = (date: Dayjs | null, dateString: string) => {
    if (onChange) {
      if (!date) {
        onChange(undefined);
      } else {
        // Convert to epoch timestamp in Asia/Kolkata timezone
        const indiaDate = date.tz("Asia/Kolkata");
        onChange(indiaDate.valueOf());
      }
    }
  };

  // Convert epoch value to dayjs object for display
  const displayValue = React.useMemo(() => {
    if (value === undefined || value === null) return "";

    // Ensure the value is treated as an epoch timestamp
    const parsedDate = dayjs(value);

    return parsedDate.isValid() ? parsedDate : "";
  }, [value]);

  return (
    <AntDatePicker
      {...rest}
      value={displayValue}
      onChange={handleChange}
      format={format}
      disabledDate={disabledDate}
      showHour={showHour}
      showMinute={showMinute}
      showTime={showTime}
      use12Hours={use12Hours}
      style={{ width: "100%", ...rest.style }}
    />
  );
};

export default CustomDatePicker;
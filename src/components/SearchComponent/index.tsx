/* eslint-disable */
import {
  ChangeEventHandler,
  SVGProps,
  FunctionComponent,
  FocusEvent,
} from "react";
import styles from "./index.module.scss";
import { Input } from "antd";

interface ISearchComponent {
  value: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  customClass?: string;
  LeadingIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  suggestions?: string[];
  suggestionsVisible?: boolean;
  onSuggestionClick?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchComponent = ({
  value,
  onChange,
  placeholder,
  customClass,
  LeadingIcon,
  suggestions = [],
  suggestionsVisible = false,
  onSuggestionClick,
  onFocus,
  onBlur,
  onKeyDown
}: ISearchComponent) => {

  const handleSuggestionClick = (value: string) => {
  if (onChange) {
    onChange({ target: { value } } as any);
  }
  if (onSuggestionClick) {
    onSuggestionClick(value);
  }
};


  return (
    <div className={styles.wrapper}>
      <Input
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        allowClear
        prefix={LeadingIcon ? <LeadingIcon /> : null}
        placeholder={placeholder}
        className={styles.container}
        onKeyDown={onKeyDown}
      />
      {suggestionsVisible && suggestions.length > 0 && (
        <div className={styles.suggestions}>
          {suggestions.map((term, i) => (
            <div
              key={i}
              className={styles.suggestionItem}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSuggestionClick.bind(null, term)}
            >
              {term}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;

import {
  InputNumber,
} from "primereact/inputnumber";
import { ErrorMessage, useField, useFormikContext } from "formik";
import { isInvalid } from "../../../core/shared/utils/utils";

interface Props {
  label: string;
  name: string;
  type?: string;
  onBlur?: (e: any, form?: any) => void;
  placeholder?: string;
  [x: string]: any;
}

export const TextNumber = ({ label, type, onBlur, ...props }: Props) => {
  const [{ onChange, ...field }, meta, helpers] = useField({ ...props });
  const { setValue } = helpers;
  const form = useFormikContext();

  const desformatValue = (value: any) => {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const desformatted = value.replace(/[^0-9.-]+/g, "");
      const parsed = parseFloat(desformatted);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  return (
    <>
      <div className="flex flex-col text-left w-48 gap-1">
        <label className="text-sm" htmlFor="number-input">
          {label}
        </label>
        <InputNumber
          inputId={props.name}
          invalid={isInvalid(meta)}
          // readOnly={false}
          onInput={(e: any) => {
            setValue(desformatValue(e.target.value));
          }}
          size={15}
          mode="currency"
          currency="USD"
          locale="en-US"
          onChange={(e) => {
            setValue(e.value);
          }}
          {...field}
          {...props}
          onBlur={(e) => onBlur?.(e, form)}
        />
        <ErrorMessage
          name={props.name}
          render={(msg) => <small className="p-error">{msg}</small>}
        />
      </div>
    </>
  );
};

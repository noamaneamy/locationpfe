import { useTranslation } from "react-i18next";

const FormInput = ({ name, type, placeholder, refe, required }) => {
  const { t } = useTranslation();
  const displayName = placeholder || (name ? name[0].toUpperCase() + name.substring(1) : "");

  return (
    <div className="form-group mb-3">
      <label className="form-label" htmlFor={name}>
        {displayName}
      </label>
      <input
        className="form-control"
        type={type}
        id={name}
        name={name}
        placeholder={displayName}
        ref={refe}
        required={required}
      />
    </div>
  );
};

export default FormInput;

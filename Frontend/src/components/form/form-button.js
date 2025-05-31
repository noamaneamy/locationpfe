const FormButton = ({ type = "submit", text, bgColor = "" }) => {
  return (
    <div className="form-group">
      <button type={type} className={`btn btn-primary w-100 ${bgColor}`}>
        {text}
      </button>
    </div>
  );
};

export default FormButton;

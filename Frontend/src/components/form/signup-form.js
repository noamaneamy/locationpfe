import { useRef } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import FormButton from "./form-button";
import FormInput from "./form-input";
import { showToast } from "../toast-alert";
import { useTranslation } from "react-i18next";
import API from "../../config/api";

const SignUpForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const navigate = (route) => navigation(route);
  const toast = useToast();
  const firstname = useRef();
  const lastname = useRef();
  const telephone = useRef();
  const email = useRef();
  const password = useRef();
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  async function createUserAccount(e) {
    e.preventDefault();

    if (!password.current.value.match(passwordRegEx)) {
      showToast(
        toast,
        "Password must be minimum 8 characters, at least 1 letter and 1 number."
      );
      return;
    }

    try {
      const hashedPassword = bcrypt.hashSync(password.current.value);
      await API.post("/signup", {
        firstname: firstname.current.value,
        lastname: lastname.current.value,
        telephone: telephone.current.value,
        email: email.current.value,
        password: hashedPassword,
      });

      showToast(toast, "Account created successfully.", "success", "Success");
      navigate("/login");
    } catch (error) {
      showToast(
        toast,
        error.response?.data?.message || "Error creating account. Please try again."
      );
    }
  }

  return (
    <div className="col-md-6 col-lg-6 p-md-5 px-4 py-5">
      <form onSubmit={createUserAccount}>
        <FormInput
          name="firstname"
          type="text"
          placeholder={t("form.firstname")}
          refe={firstname}
          required
        />
        <FormInput
          name="lastname"
          type="text"
          placeholder={t("form.lastname")}
          refe={lastname}
          required
        />
        <FormInput
          name="telephone"
          type="tel"
          placeholder={t("form.telephone")}
          refe={telephone}
          required
        />
        <FormInput
          name="email"
          type="email"
          placeholder={t("form.email")}
          refe={email}
          required
        />
        <FormInput
          name="password"
          type="password"
          placeholder={t("form.password")}
          refe={password}
          required
        />
        <FormButton type="submit" text={t("form.createAccount")} />
      </form>
    </div>
  );
};

export default SignUpForm;

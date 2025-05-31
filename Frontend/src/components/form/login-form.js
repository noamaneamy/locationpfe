import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import bcrypt from "bcryptjs";
import FormButton from "./form-button";
import FormInput from "./form-input";
import useAuthentication from "../../useAuthentication";
import { showToast } from "../toast-alert";
import { useTranslation } from "react-i18next";
import API from "../../config/api";

const LoginForm = () => {
  const { t } = useTranslation();
  const { setLoggedIn } = useAuthentication();
  const navigation = useNavigate();
  const navigate = (route) => navigation(route);
  const toast = useToast();
  const email = useRef();
  const password = useRef();

  async function Login(e) {
    e.preventDefault();

    try {
      const response = await API.post("/login", {
        email: email.current.value,
      });

      const { id, firstname, lastname, telephone, email: userEmail } = response.data.data;

      const verifyPassword = bcrypt.compareSync(
        password.current.value,
        response.data.pass
      );

      if (verifyPassword) {
        showToast(
          toast,
          "You've logged in successfully.",
          "success",
          "Success"
        );

        localStorage.setItem("id", id);
        localStorage.setItem("firstname", firstname);
        localStorage.setItem("lastname", lastname);
        localStorage.setItem("telephone", telephone);
        localStorage.setItem("email", userEmail);
        setLoggedIn(true);
        navigate("/cars");
      } else {
        showToast(toast, "Wrong password, please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast(
        toast,
        error.response?.data?.message || "An error occurred during login."
      );
    }
  }

  return (
    <div className="col-md-6 col-lg-6 p-md-5 px-4 py-5">
      <form onSubmit={Login}>
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
        <FormButton type="submit" text={t("form.signIn")} />
      </form>
    </div>
  );
};

export default LoginForm;

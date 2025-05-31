import {
  Box,
  Text,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import API from "../../config/api";

const AvatarMenu = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const fullname =
    localStorage.getItem("firstname") + " " + localStorage.getItem("lastname");
  const email = localStorage.getItem("email");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const to_route = useNavigate();
  const navigate = (route) => {
    to_route(route);
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await API.get("/logout");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [currentLanguage, setCurrentLanguage] = useState("en");

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
      >
        <Avatar size={"sm"} />
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Box>
            <Text fontWeight="500">{fullname}</Text>
            <Text fontSize="sm" color="gray.500">
              {email}
            </Text>
          </Box>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => navigate("/profile")}>
          {t("navbar.profile")}
        </MenuItem>
        <MenuItem onClick={handleLogout}>{t("navbar.logout")}</MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage("fr")}>Français</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AvatarMenu;

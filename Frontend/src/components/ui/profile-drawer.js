import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Stack,
  Box,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../config/api";
import { showToast } from "../toast-alert";

function ProfileDrawer() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const user_id = localStorage.getItem("id");
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    telephone: "",
  });

  useEffect(() => {
    setFormData({
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      telephone: localStorage.getItem("telephone"),
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await API.put(`/users/${user_id}`, formData);
      const updatedUser = response.data.data;
      localStorage.setItem("firstname", updatedUser.firstname);
      localStorage.setItem("lastname", updatedUser.lastname);
      localStorage.setItem("telephone", updatedUser.telephone);
      showToast(toast, "Profile updated successfully!", "success", "Success");
      onClose();
    } catch (error) {
      showToast(
        toast,
        error.response?.data?.message || "Error updating profile.",
        "error",
        "Error"
      );
    }
  };

  return (
    <>
      <Button leftIcon={<EditIcon />} colorScheme="blue" onClick={onOpen}>
        {t("profile.edit")}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {t("profile.editProfile")}
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="firstname">{t("profile.firstname")}</FormLabel>
                <Input
                  ref={firstField}
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="lastname">{t("profile.lastname")}</FormLabel>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="telephone">{t("profile.telephone")}</FormLabel>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              {t("profile.cancel")}
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {t("profile.submit")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ProfileDrawer;

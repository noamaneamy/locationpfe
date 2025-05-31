import {
  Box,
  Container,
  HStack,
  TableContainer,
  Thead,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  VStack,
  Heading,
  Spacer,
  Divider,
  Text,
} from "@chakra-ui/react";
import ProfileDrawer from "../components/ui/profile-drawer";
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import AvatarMenu from "../components/navbar/avatar-menu";
import Navbar from "../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../config/api";

function Profile() {
  const { t } = useTranslation();
  const user_id = localStorage.getItem("id");
  const [rents, setRents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get(`/users/${user_id}/rents`)
      .then((response) => {
        setRents(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading rentals:", error);
        setIsLoading(false);
      });
  }, [user_id]);

  return (
    <>
      <Navbar
        sidebarContent={<HomeSidebarContent />}
        links={<NavbarLinks />}
        buttons={<AvatarMenu />}
      />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">{t("profile.heading")}</Heading>
            <ProfileDrawer />
          </HStack>
          <Divider />
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("profile.brand")}</Th>
                  <Th>{t("profile.model")}</Th>
                  <Th>{t("profile.type")}</Th>
                  <Th>{t("profile.price")}</Th>
                  <Th>{t("profile.gearbox")}</Th>
                  <Th>{t("profile.rentalDate")}</Th>
                  <Th>{t("profile.returnDate")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rents.length > 0 ? (
                  rents.map((rent) => (
                    <Tr key={rent.id}>
                      <Td>{rent.car?.brand}</Td>
                      <Td>{rent.car?.model}</Td>
                      <Td>{rent.car?.fuel_type}</Td>
                      <Td>${rent.price}</Td>
                      <Td>{rent.car?.gearbox}</Td>
                      <Td>{rent.rental_date}</Td>
                      <Td>{rent.return_date}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center">
                      {t("profile.noData")}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Container>
    </>
  );
}

export default Profile;

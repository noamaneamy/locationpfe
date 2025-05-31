import { Box, GridItem, SimpleGrid, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import CarCard from "../components/ui/car-card";
import Footer from "../components/footer";
import LoadingSpinner from "../components/ui/loading-spinner";
import SearchInput from "../components/search";
import AvatarMenu from "../components/navbar/avatar-menu";
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import SearchContext from "../SearchContext";
import API from "../config/api";

function BookCars() {
  const { searchResults, setSearchResults } = useContext(SearchContext);
  const [cars, setCars] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/cars")
      .then((response) => {
        setCars(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading cars:", error);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Navbar
        sidebarContent={<HomeSidebarContent />}
        links={<NavbarLinks />}
        buttons={<AvatarMenu />}
      />
      <Box p={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {(searchResults.length > 0 ? searchResults : cars).map((car) => (
            <GridItem key={car.id}>
              <CarCard props={car} />
            </GridItem>
          ))}
        </SimpleGrid>
      </Box>
      <Footer />
    </>
  );
}

export default BookCars;

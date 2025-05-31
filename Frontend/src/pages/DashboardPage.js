import {
  Box,
  TableContainer,
  Thead,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  IconButton,
  Heading,
  Flex,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  useToast,
  Button,
  HStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import AvatarMenu from "../components/navbar/avatar-menu";
import SidebarContent from "../components/dashboard/sidebar-content";
import SearchInput from "../components/search";
import { useContext, useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import EditItemDrawer from "../components/dashboard/edit-drawer";
import { showToast } from "../components/toast-alert";
import CreateItemDrawer from "../components/dashboard/create-drawer";
import SearchContext from "../SearchContext";
import { useTranslation } from "react-i18next";
import API from "../config/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { searchResults, setSearchResults } = useContext(SearchContext);
  const [data, setData] = useState([]);
  const [header, setHeader] = useState([]);
  const [type, setType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email !== "admin@gmail.com") {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleData = async (selectedType) => {
    try {
      let response;
      switch (selectedType) {
        case "Users":
          response = await API.get("/users");
          setHeader(["id", "firstname", "lastname", "telephone", "email"]);
          setType("users");
          break;
        case "Cars":
          response = await API.get("/cars");
          setHeader([
            "id",
            "brand",
            "model",
            "gearbox",
            "fuel_type",
            "price",
            "available",
          ]);
          setType("cars");
          break;
        case "Rents":
          response = await API.get("/rents");
          setHeader([
            "id",
            "rental_date",
            "return_date",
            "price",
            "user_id",
            "car_id",
          ]);
          setType("rents");
          break;
        default:
          return;
      }
      
      if (response?.data?.data) {
        setData(response.data.data);
        setSearchResults([]);
      }
    } catch (error) {
      showToast(
        toast,
        `Error loading ${selectedType}: ${error.message}`,
        "error",
        "Error"
      );
    }
  };

  const handleUpdateItem = async (itemId, updatedItem) => {
    try {
      const response = await API.put(`/${type}/${itemId}`, updatedItem);
      if (response?.data?.data) {
        showToast(toast, `${type} updated successfully!`, "success", "Success");
        setData((prevData) =>
          prevData.map((item) => (item.id === itemId ? response.data.data : item))
        );
        onEditClose();
      }
    } catch (error) {
      showToast(
        toast,
        `Error updating ${type}: ${error.message}`,
        "error",
        "Error"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/${type}/${id}`);
      showToast(toast, `${type} deleted successfully!`, "success", "Success");
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      showToast(
        toast,
        `Error deleting ${type}: ${error.message}`,
        "error",
        "Error"
      );
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    onEditOpen();
  };

  const formatValue = (key, value) => {
    if (key === "available") {
      return (
        <Badge colorScheme={value === 1 ? "green" : "red"}>
          {value === 1 ? "Available" : "Not Available"}
        </Badge>
      );
    }
    if (key === "price") {
      return `$${value}`;
    }
    if (key === "rental_date" || key === "return_date") {
      return new Date(value).toLocaleDateString();
    }
    return value;
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar
        sidebarContent={<SidebarContent handleData={handleData} />}
        links={<></>}
        buttons={
          <>
            <SearchInput type={type} />
            <AvatarMenu />
          </>
        }
      />

      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="lg" textTransform="capitalize">
            {type || "Dashboard"}
          </Heading>
          {type && (
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onCreateOpen}>
              Add {type.slice(0, -1)}
            </Button>
          )}
        </Flex>

        {!type && (
          <Text fontSize="lg" color="gray.600" mb={4}>
            Select a category from the sidebar to manage your data
          </Text>
        )}

        {type && (
          <Box bg="white" rounded="lg" shadow="base" overflow="hidden">
            <TableContainer>
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    {header.map((title) => (
                      <Th key={title}>{title}</Th>
                    ))}
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(searchResults.length > 0 ? searchResults : data).map(
                    (item) => (
                      <Tr key={item.id}>
                        {header.map((key) => (
                          <Td key={key}>{formatValue(key, item[key])}</Td>
                        ))}
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Edit"
                              icon={<EditIcon />}
                              onClick={() => handleEdit(item)}
                              colorScheme="blue"
                              size="sm"
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<DeleteIcon />}
                              onClick={() => handleDelete(item.id)}
                              colorScheme="red"
                              size="sm"
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    )
                  )}
                  {(searchResults.length === 0 && data.length === 0) && (
                    <Tr>
                      <Td colSpan={header.length + 1} textAlign="center">
                        No data available
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>

      {/* Create Drawer */}
      {isCreateOpen && (
        <CreateItemDrawer
          dataType={type}
          isOpen={isCreateOpen}
          onClose={onCreateClose}
          onUpdate={() => handleData(type.charAt(0).toUpperCase() + type.slice(1))}
        />
      )}

      {/* Edit Drawer */}
      {isEditOpen && selectedItem && (
        <EditItemDrawer
          dataType={type}
          item={selectedItem}
          isOpen={isEditOpen}
          onClose={onEditClose}
          onUpdate={handleUpdateItem}
        />
      )}
    </Box>
  );
}

export default Dashboard;

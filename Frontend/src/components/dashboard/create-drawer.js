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
  useToast,
  Select,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { showToast } from "../toast-alert";
import API from "../../config/api";

function CreateItemDrawer({ dataType, isOpen, onClose, onUpdate }) {
  const firstField = useRef();
  const toast = useToast();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = {
        cars: ['brand', 'model', 'gearbox', 'fuel_type', 'price', 'available'],
        users: ['firstname', 'lastname', 'telephone', 'email'],
        rents: ['rental_date', 'return_date', 'price', 'user_id', 'car_id']
      };

      const missingFields = requiredFields[dataType]?.filter(field => !formData[field]);
      
      if (missingFields?.length > 0) {
        showToast(toast, `Please fill in all required fields: ${missingFields.join(', ')}`, "error", "Error");
        return;
      }

      // Validate specific fields
      if (dataType === 'cars') {
        if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
          showToast(toast, "Price must be a positive number", "error", "Error");
          return;
        }
      }

      if (dataType === 'rents') {
        const rental_date = new Date(formData.rental_date);
        const return_date = new Date(formData.return_date);
        const now = new Date();

        if (rental_date < now) {
          showToast(toast, "Rental date cannot be in the past", "error", "Error");
          return;
        }
        if (return_date <= rental_date) {
          showToast(toast, "Return date must be after rental date", "error", "Error");
          return;
        }
        if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
          showToast(toast, "Price must be a positive number", "error", "Error");
          return;
        }
      }

      if (dataType === 'users') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          showToast(toast, "Please enter a valid email address", "error", "Error");
          return;
        }
        const phoneRegex = /^\+?[\d\s-]{8,}$/;
        if (!phoneRegex.test(formData.telephone)) {
          showToast(toast, "Please enter a valid phone number", "error", "Error");
          return;
        }
      }

      const response = await API.post(`/${dataType}`, formData);
      showToast(toast, `${dataType} created successfully!`, "success", "Success");
      onUpdate();
      onClose();
      setFormData({});
    } catch (error) {
      showToast(
        toast,
        error.response?.data?.message || `Error creating ${dataType}`,
        "error",
        "Error"
      );
    }
  };

  const renderInputFields = () => {
    if (dataType === "cars") {
      return (
        <>
          <Box>
            <FormLabel htmlFor="photo1">Photo 1</FormLabel>
            <Input ref={firstField} id="photo1" onChange={handleChange} />
          </Box>
          <Box>
            <FormLabel htmlFor="photo2">Photo 2</FormLabel>
            <Input id="photo2" onChange={handleChange} />
          </Box>
          <Box>
            <FormLabel htmlFor="brand">Brand</FormLabel>
            <Input id="brand" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="model">Model</FormLabel>
            <Input id="model" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="gearbox">Gearbox</FormLabel>
            <Select id="gearbox" onChange={handleChange} required>
              <option value="">Select gearbox type</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </Select>
          </Box>
          <Box>
            <FormLabel htmlFor="fuel_type">Fuel Type</FormLabel>
            <Select id="fuel_type" onChange={handleChange} required>
              <option value="">Select fuel type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </Select>
          </Box>
          <Box>
            <FormLabel htmlFor="price">Price</FormLabel>
            <Input type="number" id="price" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="available">Availability</FormLabel>
            <Select id="available" onChange={handleChange} required>
              <option value="">Select availability</option>
              <option value="1">Available</option>
              <option value="0">Not Available</option>
            </Select>
          </Box>
        </>
      );
    } else if (dataType === "users") {
      return (
        <>
          <Box>
            <FormLabel htmlFor="firstname">First Name</FormLabel>
            <Input ref={firstField} id="firstname" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="lastname">Last Name</FormLabel>
            <Input id="lastname" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="telephone">Telephone</FormLabel>
            <Input id="telephone" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input type="email" id="email" onChange={handleChange} required />
          </Box>
        </>
      );
    } else if (dataType === "rents") {
      return (
        <>
          <Box>
            <FormLabel htmlFor="rental_date">Rental Date</FormLabel>
            <Input type="date" ref={firstField} id="rental_date" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="return_date">Return Date</FormLabel>
            <Input type="date" id="return_date" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="price">Price</FormLabel>
            <Input type="number" id="price" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="user_id">Customer ID</FormLabel>
            <Input type="number" id="user_id" onChange={handleChange} required />
          </Box>
          <Box>
            <FormLabel htmlFor="car_id">Car ID</FormLabel>
            <Input type="number" id="car_id" onChange={handleChange} required />
          </Box>
        </>
      );
    }

    return null;
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={onClose}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Create New {dataType.slice(0, -1)}
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px">{renderInputFields()}</Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Create
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateItemDrawer;

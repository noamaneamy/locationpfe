import { SearchIcon } from "@chakra-ui/icons";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import SearchContext from "../SearchContext";
import { useTranslation } from "react-i18next";
import API from "../config/api";

const SearchInput = ({ type }) => {
  const { t } = useTranslation();
  const { setSearchResults } = useContext(SearchContext);
  const [data, setData] = useState();

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      if (["rents", "users", "cars"].includes(type)) {
        try {
          const response = await API.get(`/${type}`);
          if (!cancelRequest) {
            setData(response.data.data);
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();

    return () => {
      cancelRequest = true;
    };
  }, [type, setSearchResults]);

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();

    let filteredResults = [];
    if (data) {
      if (type === "cars") {
        filteredResults = data.filter((item) =>
          item.brand.toLowerCase().includes(searchQuery)
        );
      } else if (type === "rents") {
        filteredResults = data.filter((item) => item.user_id === searchQuery);
      } else if (type === "users") {
        filteredResults = data.filter((item) =>
          item.email.toLowerCase().includes(searchQuery)
        );
      } else {
        filteredResults = [];
      }
    }
    setSearchResults(filteredResults);
  };

  return (
    <InputGroup maxW="300px">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder={t("search.placeholder")}
        onChange={handleSearch}
      />
    </InputGroup>
  );
};

export default SearchInput;

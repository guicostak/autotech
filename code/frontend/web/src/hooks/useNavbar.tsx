import { useState } from "react";

export default function useSearch () {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return { searchValue, handleChange };
};


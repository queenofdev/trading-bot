import { SvgIcon } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useAutocomplete from "@mui/material/useAutocomplete";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";

import { Betting_CryptoCurrencies } from "../../core/constants/basic";

const Input = styled("input")(({ theme }) => ({
  width: 130,
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  color: theme.palette.mode === "light" ? "#000" : "#fff",
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: 200,
  margin: 0,
  padding: 0,
  zIndex: 20,
  position: "absolute",
  left: 20,
  top: 37,
  listStyle: "none",
  overflow: "auto",
  maxHeight: 500,
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

const Search = () => {
  const navigate = useNavigate();
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: Betting_CryptoCurrencies,
    getOptionLabel: (option) => option.name,
  });

  const isOpenList = useMemo(() => groupedOptions.length > 0, [groupedOptions]);

  useEffect(() => {
    if (value) {
      navigate(`/trade?underlyingToken=${value.symbol.toLowerCase()}`);
    }
  }, [value]);

  return (
    <div className="xs:hidden lg:block relative">
      <div
        {...getRootProps()}
        className={
          "w-200 flex items-center rounded-3xl text-primary border-solid border-2 focus:border-b-0 border-bunker px-10 py-5 ml-20 bg-lightbunker" +
          (isOpenList ? " rounded-b-none" : "")
        }
      >
        <SvgIcon component={SearchIcon} />
        <Input
          {...getInputProps()}
          placeholder="Search for a token"
          className="outline-none border-0 bg-lightbunker text-primary ml-10 text-14"
        />
      </div>
      {isOpenList ? (
        <Listbox
          {...getListboxProps()}
          className="bg-lightbunker rounded-b-3xl shadow-3xl"
          sx={{ "& li.Mui-focused": { backgroundColor: "#0E1415" } }}
        >
          {(groupedOptions as typeof Betting_CryptoCurrencies).map((option, index) => (
            <li {...getOptionProps({ option, index })} className="hover:bg-bunker">
              <div className="flex px-15 py-5">
                <div className="token-logo flex justify-center items-center sm:w-30">
                  <img
                    src={`./assets/images/${option.symbol}.png`}
                    alt={`${option.symbol} logo`}
                  />
                </div>
                <div className="px-10">
                  <p className="betting-token text-15 text-primary">{option.name}</p>
                  <p className="token-pair text-14 text-second">
                    {option.symbol}/{"DAI"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </Listbox>
      ) : null}
    </div>
  );
};

export default Search;

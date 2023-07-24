import React, { useState } from "react";
import jsonData from "./sample.json";
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface Item {
  code: string;
  description: string;
  varieties: string[];
}

interface Variety {
  code: string;
  description: string;
  options: Option[];
}

interface Option {
  code: string;
  description: string;
}

const ProductForm: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedVarieties, setSelectedVarieties] = useState<{
    [key: string]: Option;
  }>({});

  const handleItemChange = (event: SelectChangeEvent<string>) => {
    const selectedItemCode = event.target.value;
    const selectedItem = jsonData.items.find(
      (item: Item) => item.code === selectedItemCode
    );
    setSelectedItem(selectedItem || null);
    setSelectedVarieties({});
  };

  const handleVarietyChange = (
    varietyCode: string,
    event: SelectChangeEvent<string>
  ) => {
    const selectedOptionCode = event.target.value;
    setSelectedVarieties((prevVarieties: { [key: string]: Option }) => ({
      ...prevVarieties,
      [varietyCode]: jsonData.varieties
        .find((variety: Variety) => variety.code === varietyCode)
        ?.options.find(
          (option: Option) => option.code === selectedOptionCode
        ) || { code: "", description: "" },
    }));
  };

  const getVarietyOptions = (varietyCode: string): Option[] => {
    const variety = jsonData.varieties.find(
      (variety: Variety) => variety.code === varietyCode
    );
    return variety ? variety.options : [];
  };

  const getSelectedVarietiesDisplay = (): string => {
    const varietyCodes = selectedItem?.varieties || [];
    return varietyCodes
      .map((varietyCode) => selectedVarieties[varietyCode]?.code || "")
      .filter(Boolean)
      .join(".");
  };

  const getLabel = (varietyCode: string): string | undefined => {
    return jsonData.varieties.find((variety: Variety) => variety.code === varietyCode)
      ?.description;
  };

  return (
    <Container maxWidth="sm" className="mt-10 bg-slate-100 rounded-lg py-5 border-[1px] border-slate-400 shadow-md">
      <Typography variant="h4" component="h1" className="mb-10 text-2xl" mb={4} textAlign={"center"}>
        Product Code
      </Typography>
      <FormControl fullWidth variant="outlined">
        <InputLabel>Select Product</InputLabel>
        <Select
          onChange={handleItemChange}
          label="Select Product"
          value={selectedItem?.code || ""}
          className="bg-white mb-4"
        >
          <MenuItem value="">
            <em>Select an item</em>
          </MenuItem>
          {jsonData.items.map((item: Item) => (
            <MenuItem key={item.code} value={item.code}>
              {item.description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedItem && selectedItem.varieties.length > 0 && (
        <div>
          {selectedItem.varieties.map((varietyCode) => (
            <div key={varietyCode} className="mb-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel>{getLabel(varietyCode)}</InputLabel>
                <Select
                  onChange={(event) => handleVarietyChange(varietyCode, event)}
                  fullWidth
                  label={getLabel(varietyCode)}
                  variant="outlined"
                  value={selectedVarieties[varietyCode]?.code || ""}
                  className="bg-white"
                >
                  <MenuItem value="">
                    <em>Select an option</em>
                  </MenuItem>
                  {getVarietyOptions(varietyCode).map((option: Option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <div>
          <Typography variant="h6" component="h2" className="mb-2">
            Selected Product: {selectedItem.description}
          </Typography>
          <Typography variant="body1" className="mb-2">
            Product Code: {selectedItem.code}
          </Typography>

          {getSelectedVarietiesDisplay() && (
            <>
              <Typography variant="body1" className="mb-2">
                Varieties: {getSelectedVarietiesDisplay()}
              </Typography>
              <Typography variant="body1">
                Combined Code:{" "}
                {selectedItem.code + "." + getSelectedVarietiesDisplay()}
              </Typography>
            </>
          )}
        </div>
      )}
    </Container>
  );
};

export default ProductForm;

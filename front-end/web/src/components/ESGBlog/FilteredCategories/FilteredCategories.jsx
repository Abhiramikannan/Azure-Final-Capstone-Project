import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const FilterCategories = ({ categories, selectedCategories, handleCategoryChange }) => {
  return (
    <div style={{marginLeft:"30px"}}>
      {categories.map((category) => (
        <FormControlLabel
          key={category}
          control={
            <Checkbox
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
          }
          label={category}
        />
      ))}
    </div>
  );
};

export default FilterCategories;

import React from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const filterOptions = ['All', 'Event', 'Result', 'Placement'];

  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={currentFilter}
          label="Filter by Type"
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;

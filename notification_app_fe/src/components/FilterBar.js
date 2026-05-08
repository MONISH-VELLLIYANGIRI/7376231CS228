import React from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme } from '@mui/material';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const filterOptions = ['All', 'Event', 'Result', 'Placement'];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      mb: 3, 
      display: 'flex', 
      gap: 2, 
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      <FormControl sx={{ 
        minWidth: isMobile ? '100%' : 220,
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={currentFilter}
          label="Filter by Type"
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option === 'All' && '📋 All Notifications'}
              {option === 'Event' && '📅 Events'}
              {option === 'Result' && '📊 Results'}
              {option === 'Placement' && '💼 Placements'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <span style={{
        fontSize: '13px',
        color: '#999',
        fontStyle: 'italic',
      }}>
        Current: {currentFilter}
      </span>
    </Box>
  );
};

export default FilterBar;

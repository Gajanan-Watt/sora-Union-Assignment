import { useState, useEffect } from 'react';
import './App.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Grid2 } from '@mui/material';


function App() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortType, setSortType] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3000/data');
        const result = await response.json();
        const transformedData = result.map((el) => ({
          fileName: el[1],
          timeStamp: el[0]
        }));
        setData(transformedData);
        setSortedData(transformedData); // Initially display unsorted data
        console.log("transformedData", transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const naturalSort = (a, b) => {
    const regex = /(\d+)|(\D+)/g;

    const aParts = a.fileName.match(regex);
    const bParts = b.fileName.match(regex);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || '';
      const bPart = bParts[i] || '';

      if (!isNaN(aPart) && !isNaN(bPart)) {
        const numA = parseInt(aPart, 10);
        const numB = parseInt(bPart, 10);
        if (numA !== numB) return numA - numB;
      }

      if (aPart !== bPart) return aPart.localeCompare(bPart);
    }

    return 0;
  };

  useEffect(() => {
    const sortData = () => {
      const sorted = [...data];
      if (sortType === 'createdAtAsc') {
        sorted.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
      } else if (sortType === 'filenameAsc') {
        sorted.sort(naturalSort);
      } else if (sortType === 'filenameDesc') {
        sorted.sort((a, b) => naturalSort(b, a));
      }
      setSortedData(sorted);
    };
    sortData();
  }, [sortType, data]);

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
        <Typography variant="h2" gutterBottom sx={{textAlign: 'center'}}>
          File List
        </Typography>

        <Box sx={{ width: 210, backgroundColor: 'lightgray' }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortType}
              label="Sort By"
              onChange={(e) => setSortType(e.target.value)}
              >
              <MenuItem value="createdAtAsc">Created At Ascending</MenuItem>
              <MenuItem value="filenameAsc">Filename Ascending</MenuItem>
              <MenuItem value="filenameDesc">Filename Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flexGrow: 1, marginTop: '50px' }}>
          <Grid2 container spacing={{ xs: 2, md: 4 }} columns={{ xs: 12, sm: 12, md: 12 }} sx={{ justifyContent: 'center' }}>
            {
              sortedData.map((el, index) => (
                <Grid2 item xs={6} sm={6} md={6} key={index}>
                  <Paper sx={{ padding: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {el.timeStamp}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {el.fileName}
                    </Typography>
                  </Paper>
                </Grid2>
              ))
            }
          </Grid2>
        </Box>
      </Box>
    </>
  );
}

export default App;

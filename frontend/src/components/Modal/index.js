import { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete, Box, Tab, Tabs, MenuItem  } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { autocomplete } from '../../utils/api/stocksApiFunction';
import { currencies } from '../../constants/currencies';
import { transfers } from '../../constants/common';

function Modal(props) {
  const [value, setValue] = useState(new Date());
  const [tab, setTab] = useState(0);
  const [transferDropdown, setTransferDropdwon] = useState('in');
  const [transactionForm, setTransactionForm] = useState({
    category: '',
    assets: [],
    asset: '',
    currency: '',
    price: '',
    date: new Date()
  })

  const handleCategoryChange = (event, value) => {
    setTransactionForm({
      ...transactionForm,
      category: value.alias
    })
  }

  const handleAssetChange = (event, value) => {
    console.log(event.target.value)
    console.log(value)
    if (transactionForm.category) {
      switch (transactionForm.category) {
        case 'stocks':
          break;
        default:
          setTransactionForm({
            ...transactionForm,
            asset: value.alias
          })
          break;
      }
    }

  }

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleTransferChange = (event) => {
    setTransferDropdwon(event.target.value);
  }; 

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await autocomplete('apple');
      setTransactionForm({
        ...transactionForm,
        assets: responseData.data.ResultSet.Result
      })
    }
  
    if (transactionForm.category === 'stocks') {
      fetchData().catch(console.error);
    }
  }, [transactionForm.category])

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  return (
    <>
        <Dialog open={props.open} onClose={props.close} fullWidth>
          <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                  {props.contentText}
              </DialogContentText>
              <Box sx={{ width: 1 }}>
                  {
                    props.tabs && <Tabs centered
                                    textColor="primary"
                                    indicatorColor="primary" 
                                    value={tab} 
                                    onChange={handleTabChange} >
                                    <Tab label="Buy" {...a11yProps(0)} />
                                    <Tab label="Sell" {...a11yProps(1)} />
                                    <Tab label="Transfer" {...a11yProps(2)} />
                                  </Tabs>
                  }
                  <Autocomplete
                    id="category"
                    sx={{ mt: 2, mb: 1 }}
                    options={props.categories}
                    onChange={handleCategoryChange}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => {
                      if (option.show) {
                        return <Box component="li" {...props}>
                                  {option.name}
                                </Box>
                      }
                    }}
                    renderInput={(params) => {
                      return <TextField
                        {...params}
                        label="Choose a category"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    }}
                  />
                  <Autocomplete
                    id="asset"
                    sx={{ mt: 2, mb: 1 }}
                    options={[]}
                    onChange={handleAssetChange}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => {
                      if (option.show) {
                        return <Box component="li" {...props}>
                                  {option.name}
                                </Box>
                      }
                    }}
                    renderInput={(params) => {
                      return <TextField
                        {...params}
                        label="Choose an asset"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    }}
                  />
                  {/* <TextField
                    onChange={handleAssetChange}
                    sx={{ mt: 1, mb: 1 }}
                    margin="dense"
                    id="asset"
                    label="Asset"
                    type="text"
                    fullWidth
                  /> */}
                  { 
                    tab !== 2 && <Box sx={{ display: 'grid' }}>
                                  <TextField
                                    sx={{ gridColumn: '1',  mt: 1, mb: 1 }}
                                    id="outlined-select-currency"
                                    select
                                    label="Currency"
                                    value={"USD"}
                                    onChange={handleChange}>
                                    {currencies.map((option) => (
                                      <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                  <TextField
                                    sx={{ gridColumn: '2', input: {textAlign: "right"} }}
                                    margin="dense"
                                    id="price"
                                    label="Price"
                                    type="number"
                                  >
                                  </TextField>
                                </Box>
                  }
                  {
                    tab == 2 && <TextField
                                fullWidth
                                sx={{ mt: 1, mb: 1 }}
                                id="transfer"
                                select
                                label="Transfer"
                                value={transferDropdown}
                                onChange={handleTransferChange}>
                                {transfers.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                  }
                  {
                    transactionForm.category !== 'p2p' && <TextField
                                                            sx={{input: {textAlign: "right"}}}
                                                            margin="dense"
                                                            id="quantity"
                                                            label="Quantity"
                                                            type="number"
                                                            fullWidth
                                                          />
                  }
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      label="Date"
                      inputFormat="dd.MM.yyyy"
                      value={value}
                      onChange={handleChange}
                      renderInput={(params) => <TextField sx={{ mt: 2, width: 1 }} {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close}>Cancel</Button>
                <Button onClick={props.close}>Save</Button>
            </DialogActions>
        </Dialog>
    </>
  );
}

export default Modal;

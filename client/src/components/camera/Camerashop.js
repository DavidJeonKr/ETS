import React, { useEffect, useState } from "react";
import "./Camerashop.css";
import Header from "../header/Header";
import CameraPrd from './CameraPrd';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from "@material-ui/core/styles";
import CameraUpload2 from "./CameraUpload2";
import CircularProgress from '@material-ui/core/CircularProgress';

import { TableContainer } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

import {styled, alpha} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from "./Pagination";
import Chatbot from '../chatbot/chatbot';
const useStyles = makeStyles({
    root: {
      width: "100%",
      overflowX: "auto",
    },
    table: {
      minWidth: 1080,
    },
    progress: {
      margin: 10,
    },
    tableHead: {
      fontSize: '1.0rem'
    },
    menu: {
        marginTop: 15,
        display: 'flex',
        justifyContent: 'right'
    }
  });

 

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

function Computershop() {

    const classes = useStyles();
    const [customersData, setCustomersData] = useState([]);
    const [progress, setProgress] = useState(0);
    const [search, setSearch] = useState('');
    const [isLoad, setIsLoad] = useState(false);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;

    

    const callApi = async () => {
      const response = await fetch('/api/products/camera');
      const body = await response.json();
      
      console.log("body", body); 
      setIsLoad(true);
      return body;
    };

    const handleValueChange = (e) => {    
        setSearch(e.target.value)
    }
    
    const filteredComponents = (data) => {
            data = data.filter((c) => {
            return c.camera_name.indexOf(search) > -1 || c.camera_desc.indexOf(search) > -1
            
        }); 
        
        return data.slice(offset, offset + limit).map((c) => {
            return <CameraPrd stateRefresh = {stateRefresh}
            key={c.id} id={c.id} camera_name={c.camera_name} camera_image={c.camera_image} 
            camera_desc={c.camera_desc} camera_price={c.camera_price} />
        })

    }
   

    const stateRefresh = async () => {
        setSearch('');
        setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 1));
          }, 20);
        callApi().then(res => {
            setCustomersData(res);
          })
      }
  
    useEffect(() => {
        let complete = 0;
        let timer = setInterval(() => {
          if (complete >= 100) {
            complete = 0
          } else {
            complete += 1;
          }
          setProgress(complete);
          if (isLoad) {
            clearInterval(timer);
            
          }
        }, 20);
        callApi().then(res => {
            setCustomersData(res);
        }).
          catch(err => console.log(err));
      }, [isLoad]);

    //console.log(customersData);

    const cellList = ['상품 이름', '상품 이미지', '상품 내용', '상품 가격']  
    
    return (
        <>
        <Header/>
        <div className="home_containerLine"></div>
        <div className="body">
        <div className="computershop">
          {/* <label style={{marginBottom:"15px"}}>
            페이지 당 표시할 게시물 수:&nbsp;
            <select type="number" value={limit} onChange={({target: {value}}) => {
              setLimit(Number(value))
            }}>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
          </label> */}
 
            <div className= {classes.root} >
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" >
                        <Toolbar style={{backgroundColor:"#e65a41"}}>
                        
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            Camera
                        </Typography>
                        <Search style={{position:'absolute', right:'15px'}}>
                            <SearchIconWrapper>
                            <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase style={{marginRight:"20px", marginLeft:"70px"}}
                            placeholder="검색"
                            inputProps={{ 'aria-label': 'search' }}
                            value={search}
                            onChange={handleValueChange}
                            />
                        </Search>
                        </Toolbar>
                    </AppBar>
                </Box>
           
                <TableContainer component={Paper}>
                <Paper > 
                    <Table style={{backgroundColor:"#f8eee1"}} className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                               {cellList.map(c => {
                                   return <TableCell key={c.id} className={classes.tableHead}>{c}</TableCell>
                               })}
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                            {customersData !=0 ? filteredComponents(customersData): 
                            <TableRow>
                                <TableCell colSpan="6" align="center">
                                    <CircularProgress color="secondary" className={progress} variant="indeterminate" value={progress}/>
                                </TableCell>
                            </TableRow>     
                            }
                                          
                        </TableBody>      
                                   
                    </Table>
                </Paper>               
                </TableContainer>
                <div className={classes.menu}>
                    <CameraUpload2 stateRefresh = {stateRefresh} />
                </div>
                
               <Pagination total={customersData.length} limit={limit} page={page} setPage={setPage} />
            </div>
           
            {/* <Link to="/productUpload">
              <button className="write">상품등록</button>
            </Link> */}
             <div className='chatbotArea'>
                <Chatbot> </Chatbot>
            </div>
           
        </div>
        </div>
        
        </>
    );
}



export default Computershop;



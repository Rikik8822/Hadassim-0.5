import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userOut } from '../featuers/user/userSlice';


/**
 * Navbar component displays the navigation bar with different options based on the user's role.
 * It allows users to log in, register, and log out. Admin users have additional options for managing orders.
 */
const Navbar = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    let currentUser = useSelector(st => st.user.currentUser);

    /**
    * Logs out the current user by dispatching the userOut action and navigating to the home page.
    */
    function logout() {
        dispatch(userOut());
        navigate("/");
    }
    return (<>
        <Box sx={{ flexGrow: 1, width: "100vw", marginTop: "0px" }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", }}   >
                        Hello {currentUser ? currentUser.userName : "Gusset"}
                    </Typography>
                    <Button color="inherit"><Link to="/" style={{ textDecoration: 'none', color: 'inherit', textTransform: "none" }}  >Login</Link> </Button>
                    <Button color="inherit"><Link to="register" style={{ textDecoration: 'none', color: 'inherit', textTransform: "none" }}  >Register</Link></Button>
                    {currentUser?.role == "admin" && <>
                        <Button color="inherit"><Link to="/addOrder" style={{ textDecoration: 'none', color: 'inherit', textTransform: "none" }}  >Add order</Link></Button>
                        <Button color="inherit"><Link to="/AdminOrders" style={{ textDecoration: 'none', color: 'inherit', textTransform: "none" }} >All orders</Link></Button>
                        <Button color="inherit" onClick={() => logout()} sx={{ textTransform: "none" }}>Log Out</Button>
                    </>}
                    {currentUser?.role == "supplier" && <>
                        <Button color="inherit"><Link to="/supplierOrders" style={{ textDecoration: 'none', color: 'inherit', textTransform: "none" }}  >My orders</Link></Button>
                        <Button color="inherit" onClick={() => logout()} sx={{ textTransform: "none" }}>Log out</Button>
                    </>}
                </Toolbar>
            </AppBar>
        </Box>
    </>);
}

export default Navbar;
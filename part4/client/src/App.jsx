
import './App.css'
import {Route, Routes} from "react-router-dom"
import Login from './featuers/user/Login'

import CreateOrderForm from './featuers/order/CreateOrderForm'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { userIn } from './featuers/user/userSlice'
import SupplierOrders from './featuers/order/supplierOrders'
import AdminListOrders from './featuers/order/AdminListOrders'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './featuers/user/Register'




function App() {
let dispatch=useDispatch();
  useEffect(()=>{
let user=localStorage.getItem("currentUser");
if(user)
  dispatch(userIn(JSON.parse(user)));
  })
  return (
    <>
    <Navbar/>
     <Routes>
<Route path='/' element={<Login/>}/>
<Route path='register' element={<Register/>}/>
<Route path='addOrder' element={<ProtectedRoute><CreateOrderForm/></ProtectedRoute>}/>
<Route path='supplierOrders' element={<SupplierOrders/>}/>
<Route path='AdminOrders' element={<ProtectedRoute><AdminListOrders/></ProtectedRoute>}/>




     </Routes>
    </>
  )
}

export default App

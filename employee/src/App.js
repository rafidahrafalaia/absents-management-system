import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.js";
import {RequireToken} from './components/Auth.js'
 
import Dashboard from "./components/Dashboard.js";
import Home from "./components/Home.js";
import EditEmployee from './components/EditEmployee.js'
 
function App() {
  return (
    <div className="app">
        <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
               
              <Route path='/' element={
                  <RequireToken>
                    <Dashboard />
                  </RequireToken>
                  }>
                  <Route path='' element={<Home />}></Route>
                  <Route path='/profile' element={<EditEmployee />}></Route>
              </Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}
   
export default App;
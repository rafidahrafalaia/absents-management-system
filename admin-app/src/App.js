import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.js";
import {RequireToken} from './components/Auth.js'
 
import Dashboard from "./components/Dashboard.js";
import Home from "./components/Home.js";
import Notification from "./components/Notification.js";
import AddEmployee from "./components/AddEmployee.js";
import EditEmployee from './components/EditEmployee.js';
import AbsentEmployee from './components/AbsentEmployee.js';
 
function App() {
  // useEffect(() => {
  //     // Call the function to get the FCM token
  //     getFCMToken();
  // }, []);
  return (
    <div className="app">
      <header className="App-header"><Notification /></header>
        <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
               
              <Route path='/' element={
                  <RequireToken>
                    <Dashboard />
                  </RequireToken>
                  }>
                  <Route path='' element={<Home />}></Route>
                  <Route path='/edit/:id' element={<EditEmployee />}></Route>
                  <Route path='/create' element={<AddEmployee />}></Route>
                  <Route path='/absents' element={<AbsentEmployee />}></Route>
                  {/* <Route path='/employeeedit' element={<EditEmployee />}></Route> */}
              </Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}
   
export default App;
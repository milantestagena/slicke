import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserPage from './pages/UserPage';
import Header from "./components/Header";
import Login from './pages/Login';
import Register from './pages/Register';
import "./App.css";
import { store } from "./app/store";

function App() {
  console.log(store)
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<UserPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;

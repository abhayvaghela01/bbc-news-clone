// import "./App.css";
import Signin from "./Components/Signin";
import { Route, Routes } from "react-router-dom";
import Main from "./Components/Main";
import NewsDetails from "./Components/NewsDetails";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/" element={<Main />} />
      <Route path="/details" element={<NewsDetails />} />
    </Routes>
  );
}

export default App;

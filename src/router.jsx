import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Todo from "./todo";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
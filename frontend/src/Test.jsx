import { BrowserRouter, Route, Routes } from "react-router-dom";
import ExamplePage from "./pages/Example";

export function Testing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExamplePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

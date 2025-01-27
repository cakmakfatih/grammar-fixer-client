import React from "react";
import ReactDOM from "react-dom/client";
import MainLayoutComponent from "./layouts/MainLayout";
import HomePage from "./pages/Home";
import "./index.css";
import "react-notifications-component/dist/theme.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainLayoutComponent>
      <HomePage />
    </MainLayoutComponent>
  </React.StrictMode>
);

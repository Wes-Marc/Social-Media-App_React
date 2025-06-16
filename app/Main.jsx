import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import About from "./components/About";
import Terms from "./components/Terms";
import Footer from "./components/Footer";

function Main() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomeGuest />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/terms" element={<Terms />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
    module.hot.accept();
}

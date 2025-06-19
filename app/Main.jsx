import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import About from "./components/About";
import Terms from "./components/Terms";
import Footer from "./components/Footer";
import CreatePost from "./components/CreatePost";

function Main() {
    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")));

    return (
        <BrowserRouter>
            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <Routes>
                <Route path="/" element={loggedIn ? <Home /> : <HomeGuest />} />
                <Route path="/create-post" element={<CreatePost />} />
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

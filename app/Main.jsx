import React, { useState, useReducer, useEffect, useRef, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// Components
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import About from "./components/About";
import Terms from "./components/Terms";
import Footer from "./components/Footer";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
import LoadingDotsIcon from "./components/LoadingDotsIcon";

function Main() {
    const searchRef = useRef(null);

    const initialState = {
        loggedIn: Boolean(localStorage.getItem("complexappToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("complexappToken"),
            username: localStorage.getItem("complexappUsername"),
            avatar: localStorage.getItem("complexappAvatar")
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0
    };

    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true;
                draft.user = action.data;
                break;
            case "logout":
                draft.loggedIn = false;
                break;
            case "flashMessage":
                draft.flashMessages.push(action.value);
                break;
            case "openSearch":
                draft.isSearchOpen = true;
                break;
            case "closeSearch":
                draft.isSearchOpen = false;
                break;
            case "toggleChat":
                draft.isChatOpen = !draft.isChatOpen;
                break;
            case "closeChat":
                draft.isChatOpen = false;
                break;
            case "incrementUnreadChatCount":
                draft.unreadChatCount++;
                break;
            case "clearUnreadChatCount":
                draft.unreadChatCount = 0;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState);

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("complexappToken", state.user.token);
            localStorage.setItem("complexappUsername", state.user.username);
            localStorage.setItem("complexappAvatar", state.user.avatar);
        } else {
            localStorage.removeItem("complexappToken");
            localStorage.removeItem("complexappUsername");
            localStorage.removeItem("complexappAvatar");
        }
    }, [state.loggedIn]);

    // Axios request to check if token expired
    useEffect(() => {
        if (state.loggedIn) {
            const requestController = new AbortController();

            async function fetchResults() {
                try {
                    const response = await Axios.post("/checkToken", { token: state.user.token }, { signal: requestController.signal });
                    if (!response.data) {
                        dispatch({ type: "logout" });
                        dispatch({ type: "flashMessage", value: "Your session has expired. Please log in again." });
                    }
                } catch (error) {
                    console.log(error.response.data);
                }
            }
            fetchResults();

            return () => {
                requestController.abort();
            };
        }
    }, []);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header />
                    <Routes>
                        <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
                        <Route path="/profile/:username/*" element={<Profile />} />
                        <Route
                            path="/post/:id"
                            element={
                                <Suspense fallback={<LoadingDotsIcon />}>
                                    <ViewSinglePost />
                                </Suspense>
                            }
                        />
                        <Route path="/post/:id/edit" element={<EditPost />} />
                        <Route
                            path="/create-post"
                            element={
                                <Suspense fallback={<LoadingDotsIcon />}>
                                    <CreatePost />
                                </Suspense>
                            }
                        />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <CSSTransition nodeRef={searchRef} timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
                        <div ref={searchRef} className="search-overlay">
                            <Search />
                        </div>
                    </CSSTransition>
                    {state.loggedIn && <Chat />}
                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
    module.hot.accept();
}

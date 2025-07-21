import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function HeaderLoggedIn(props) {
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);

    function handleLogout() {
        appDispatch({ type: "logout" });
    }

    function handleSearchIcon(e) {
        e.preventDefault();
        appDispatch({ type: "openSearch" });
    }

    return (
        <div className="flex-row my-3 my-md-0">
            <a onClick={handleSearchIcon} data-tooltip-content="Search" data-tooltip-id="search" href="#" className="text-white mr-2 header-search-icon">
                <i className="fas fa-search"></i>
            </a>
            <Tooltip id="search" place="bottom" className="custom-tooltip" />{" "}
            <span onClick={() => appDispatch({ type: "toggleChat" })} data-tooltip-content="Chat" data-tooltip-id="chat" className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")}>
                <i className="fas fa-comment"></i>
                {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}</span> : ""}
            </span>
            <Tooltip id="chat" place="bottom" className="custom-tooltip" />{" "}
            <Link to={`/profile/${appState.user.username}`} data-tooltip-content="My Profile" data-tooltip-id="profile" className="mr-2">
                <img className="small-header-avatar" src={appState.user.avatar} />
            </Link>
            <Tooltip id="profile" className="custom-tooltip" />{" "}
            <Link className="btn btn-sm btn-success mr-2" to="/create-post">
                Create Post
            </Link>{" "}
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    );
}

export default HeaderLoggedIn;

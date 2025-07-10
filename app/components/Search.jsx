import React, { useContext, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Axios from "axios";

function Search() {
    const appDispatch = useContext(DispatchContext);

    const [state, setState] = useImmer({
        searchTerm: "",
        results: [],
        show: "neither",
        requestCount: 0
    });

    // Close Search Bar
    useEffect(() => {
        document.addEventListener("keyup", searchKeyPressHandler);
        return () => document.removeEventListener("keyup", searchKeyPressHandler);
    }, []);

    // Control Search animation behavior when typing and prepare requestCount for Axios request
    useEffect(() => {
        if (state.searchTerm.trim()) {
            setState(draft => {
                draft.show = "loading";
            });

            const delay = setTimeout(() => {
                setState(draft => {
                    draft.requestCount++;
                });
            }, 750);

            return () => clearTimeout(delay);
        } else {
            setState(draft => {
                draft.show = "neither";
            });
        }
    }, [state.searchTerm]);

    // Search Axios request logic
    useEffect(() => {
        if (state.requestCount) {
            const requestController = new AbortController();

            async function fetchResults() {
                try {
                    const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { signal: requestController.signal });
                    setState(draft => {
                        draft.results = response.data;
                        draft.show = "results";
                    });
                } catch (error) {
                    console.log(error.response.data);
                }
            }
            fetchResults();

            return () => {
                requestController.abort();
            };
        }
    }, [state.requestCount]);

    function searchKeyPressHandler(e) {
        if (e.key == "Escape") {
            appDispatch({ type: "closeSearch" });
        }
    }

    function handleInput(e) {
        const value = e.target.value;
        setState(draft => {
            draft.searchTerm = value;
        });
    }

    return (
        <>
            <div className="search-overlay-top shadow-sm">
                <div className="container container--narrow">
                    <label htmlFor="live-search-field" className="search-overlay-icon">
                        <i className="fas fa-search"></i>
                    </label>
                    <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
                    <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
                        <i className="fas fa-times-circle"></i>
                    </span>
                </div>
            </div>

            <div className="search-overlay-bottom">
                <div className="container container--narrow py-3">
                    <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
                    <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
                        {Boolean(state.results.length) && (
                            <div className="list-group shadow-sm">
                                <div className="list-group-item active">
                                    <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                                </div>
                                {state.results.map(post => {
                                    const date = new Date(post.createdDate);
                                    const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

                                    return (
                                        <Link onClick={() => appDispatch({ type: "closeSearch" })} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                                            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
                                            <span className="text-muted small">
                                                by {post.author.username} on {dateFormatted}{" "}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm">Sorry, we could not find any results for that search.</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Search;

import React, { useEffect, useState, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { useParams, Link } from "react-router";
import Axios from "axios";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function EditPost() {
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);

    const originalState = {
        title: {
            value: "",
            hasErrors: false,
            message: ""
        },
        body: {
            value: "",
            hasErrors: false,
            message: ""
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0
    };

    function ourReducer(draft, action) {
        switch (action.type) {
            case "fetchComplete":
                draft.title.value = action.value.title;
                draft.body.value = action.value.body;
                draft.isFetching = false;
                break;
            case "titleChange":
                draft.title.value = action.value;
                break;
            case "bodyChange":
                draft.body.value = action.value;
                break;
            case "submitRequest":
                draft.sendCount++;
                break;
            case "saveRequestStarted":
                draft.isSaving = true;
                break;
            case "saveRequestFinished":
                draft.isSaving = false;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, originalState);

    function submitHandler(e) {
        e.preventDefault();
        dispatch({ type: "submitRequest" });
    }

    useEffect(() => {
        const requestController = new AbortController();

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, { signal: requestController.signal });
                dispatch({ type: "fetchComplete", value: response.data });
            } catch (error) {
                console.log(error.response.data);
            }
        }
        fetchPost();

        return () => {
            requestController.abort();
        };
    }, []);

    useEffect(() => {
        if (state.sendCount) {
            dispatch({ type: "saveRequestStarted" });
            const requestController = new AbortController();

            async function fetchPost() {
                try {
                    const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { signal: requestController.signal });
                    dispatch({ type: "saveRequestFinished" });
                    appDispatch({ type: "flashMessage", value: "Post was updated." });
                } catch (error) {
                    console.log(error.response.data);
                }
            }
            fetchPost();

            return () => {
                requestController.abort();
            };
        }
    }, [state.sendCount]);

    if (state.isFetching)
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        );

    return (
        <Page title="Edit Post">
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
                </div>

                <button className="btn btn-primary" disabled={state.isSaving}>
                    Save Updates
                </button>
            </form>
        </Page>
    );
}

export default EditPost;

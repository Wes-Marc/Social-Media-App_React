import React, { useEffect, useContext } from "react";
import { useImmer } from "use-immer";
import Axios from "axios";
import { useParams, NavLink, Routes, Route } from "react-router-dom";
import StateContext from "../StateContext";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";
import ProfileFollow from "./ProfileFollow";

function Profile() {
    const appState = useContext(StateContext);
    const { username } = useParams();
    const [state, setState] = useImmer({
        followActionLoading: false,
        startFollowingRequestCount: 0,
        stopFollowingRequestCount: 0,
        profileData: {
            profileUsername: "...",
            profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
            isFollowing: false,
            counts: {
                postCount: "",
                followerCount: "",
                followingCount: ""
            }
        }
    });

    // Loads Profile Data
    useEffect(() => {
        const requestController = new AbortController();

        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { signal: requestController.signal });
                setState(draft => {
                    draft.profileData = response.data;
                });
            } catch (error) {
                console.log(error.response.data);
            }
        }
        fetchData();

        return () => {
            requestController.abort();
        };
    }, [username]);

    // Logic for Start Follow Feature
    useEffect(() => {
        if (state.startFollowingRequestCount) {
            setState(draft => {
                draft.followActionLoading = true;
            });

            const requestController = new AbortController();

            async function fetchData() {
                try {
                    const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { signal: requestController.signal });
                    setState(draft => {
                        draft.profileData.isFollowing = true;
                        draft.profileData.counts.followerCount++;
                        draft.followActionLoading = false;
                    });
                } catch (error) {
                    console.log(error.response.data);
                }
            }
            fetchData();

            return () => {
                requestController.abort();
            };
        }
    }, [state.startFollowingRequestCount]);

    // Logic for Stop Follow Feature
    useEffect(() => {
        if (state.stopFollowingRequestCount) {
            setState(draft => {
                draft.followActionLoading = true;
            });

            const requestController = new AbortController();

            async function fetchData() {
                try {
                    const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { signal: requestController.signal });
                    setState(draft => {
                        draft.profileData.isFollowing = false;
                        draft.profileData.counts.followerCount--;
                        draft.followActionLoading = false;
                    });
                } catch (error) {
                    console.log(error.response.data);
                }
            }
            fetchData();

            return () => {
                requestController.abort();
            };
        }
    }, [state.stopFollowingRequestCount]);

    function startFollowing() {
        setState(draft => {
            draft.startFollowingRequestCount++;
        });
    }

    function stopFollowing() {
        setState(draft => {
            draft.stopFollowingRequestCount++;
        });
    }

    return (
        <Page title="Profile Screen">
            <h2>
                <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
                {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
                    <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
                        Follow <i className="fas fa-user-plus"></i>
                    </button>
                )}
                {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
                    <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
                        Stop Following <i className="fas fa-user-times"></i>
                    </button>
                )}
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <NavLink to={"/profile/" + state.profileData.profileUsername} end className="nav-item nav-link">
                    Posts: {state.profileData.counts.postCount}
                </NavLink>
                <NavLink to={"/profile/" + state.profileData.profileUsername + "/followers"} className="nav-item nav-link">
                    Followers: {state.profileData.counts.followerCount}
                </NavLink>
                <NavLink to={"/profile/" + state.profileData.profileUsername + "/following"} className="nav-item nav-link">
                    Following: {state.profileData.counts.followingCount}
                </NavLink>
            </div>

            <Routes>
                <Route path="" element={<ProfilePosts />} />
                <Route path="followers" element={<ProfileFollow action="followers" />} />
                <Route path="following" element={<ProfileFollow action="following" />} />
            </Routes>
        </Page>
    );
}

export default Profile;

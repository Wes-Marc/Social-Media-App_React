import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import StateContext from "../StateContext";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";

function Profile() {
    const appState = useContext(StateContext);
    const { username } = useParams();
    const [profileData, setProfileData] = useState({
        profileUsername: "...",
        profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
        isFollowing: false,
        counts: {
            postCount: "",
            followerCount: "",
            followingCount: ""
        }
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: appState.user.token });
                setProfileData(response.data);
            } catch (error) {
                console.log(error.response.data);
            }
        }
        fetchData();
    }, []);

    return (
        <Page title="Profile Screen">
            <h2>
                <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
                <button className="btn btn-primary btn-sm ml-2">
                    Follow <i className="fas fa-user-plus"></i>
                </button>
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {profileData.counts.postCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {profileData.counts.followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {profileData.counts.followingCount}
                </a>
            </div>

            <ProfilePosts />
        </Page>
    );
}

export default Profile;

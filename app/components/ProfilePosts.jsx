import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

function ProfilePosts() {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`);
                setPosts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error.response.data);
            }
        }
        fetchPosts();
    }, [username]);

    if (isLoading) return <LoadingDotsIcon />;

    return (
        <div className="list-group">
            {posts.map(post => {
                return <Post post={post} key={post._id} noAuthor={true} />;
            })}
        </div>
    );
}

export default ProfilePosts;

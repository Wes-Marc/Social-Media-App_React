import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfileFollow(props) {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const requestController = new AbortController();

        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/${props.action}`, { signal: requestController.signal });
                setPosts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error.response.data);
            }
        }
        fetchPosts();

        return () => {
            requestController.abort();
        };
    }, [username, props.action]);

    if (isLoading) return <LoadingDotsIcon />;

    return (
        <div className="list-group">
            {posts.map((follower, index) => {
                return (
                    <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
                    </Link>
                );
            })}
        </div>
    );
}

export default ProfileFollow;

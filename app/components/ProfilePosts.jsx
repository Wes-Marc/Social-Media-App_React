import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router";
import LoadingDotsIcon from "./LoadingDotsIcon";

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
    }, []);

    if (isLoading) return <LoadingDotsIcon />;

    return (
        <div className="list-group">
            {posts.map(post => {
                const date = new Date(post.createdDate);
                const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

                return (
                    <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> <span className="text-muted small">on {dateFormatted} </span>
                    </Link>
                );
            })}
        </div>
    );
}

export default ProfilePosts;

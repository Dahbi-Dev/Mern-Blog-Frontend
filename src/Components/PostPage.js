import { format } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { PuffLoader } from 'react-spinners';

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`https://mern-blog-backend-hmpo.onrender.com/post/${id}`)
            .then((response) => {
                response.json().then((postInfo) => {
                    setPostInfo(postInfo);
                    setLoading(false);
                });
            });
    }, [id]);

    const handleDelete = () => {
        fetch(`https://mern-blog-backend-hmpo.onrender.com/post/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    setRedirect(true);
                    // Handle successful deletion (if needed)
                } else {
                    // Handle the error case
                    response.json().then((data) => {
                        console.error('Error deleting the post:', data.error);
                    });
                }
            })
            .catch((error) => {
                console.error('Error deleting the post:', error);
            });
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <PuffLoader color={'orange'} loading={loading} size={100} />
            </div>
        );
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    // Check if userInfo is defined and has the 'id' property
    const isUserAuthorized = userInfo && userInfo.id === postInfo?.author?._id;

    return (
        <div className='post-page'>
            <h1>{postInfo.title}</h1>
            <div className='time-date'>
                <p>By: {postInfo.author.username}</p>
                <time>{format(new Date(postInfo.createdAt), 'E-MM-yyyy hh:mm')}</time>
            </div>
            {isUserAuthorized && (
                <div className='edit-row'>
                    <Link className='edit-btn' to={`/edit/${postInfo._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit this post
                    </Link>
                    <Link className='delete-btn' onClick={handleDelete}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Delete
                    </Link>
                </div>
            )}
            <div className="" style={{ marginTop: '15px' }}>
                <img className="imagePage" src={`https://mern-blog-backend-hmpo.onrender.com/${postInfo.cover}`} alt="img" />
            </div>

            <div  className='content'
            dangerouslySetInnerHTML={{ __html: postInfo.content }} 
            />
        </div>
    );
}

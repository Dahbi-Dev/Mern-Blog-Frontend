import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";
import { Pencil, Trash2, User, Calendar } from "lucide-react";

export default function PostPage() {
  const api = process.env.REACT_APP_API_URL;
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${api}/post/${id}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPostInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, api]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${api}/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete post");
      }
      setShowDeleteDialog(false);
      setRedirect(true);
    } catch (err) {
      setError(err.message);
      setShowDeleteDialog(false);
    }
  };

  if (redirect) return <Navigate to="/" />;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-200">{error}</p>
      </div>
    );
  }
  if (!postInfo) return null;

  const isUserAuthorized = userInfo?.id === postInfo?.author?._id || userInfo?.username === "Houssam";

  return (
    <article className="max-w-4xl mx-auto px-4 py-28 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">{postInfo.title}</h1>

      <div className="flex flex-wrap gap-4 mb-6 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span>{postInfo.author.username}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <time>{format(new Date(postInfo.createdAt), "E-MM-yyyy HH:mm")}</time>
        </div>
      </div>

      {isUserAuthorized && (
        <div className="flex gap-4 mb-6">
          <Link
            to={`/edit/${postInfo._id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 transition-colors"
          >
            <Pencil className="w-5 h-5" />
            <span>Edit Post</span>
          </Link>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Post</span>
          </button>
        </div>
      )}

      <div className="mb-8 rounded-lg overflow-hidden">
        <img
          src={`${api}/${postInfo.cover}`}
          alt={postInfo.title}
          className="w-full h-auto object-cover"
        />
      </div>

      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </article>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";
import { Pencil, Trash2, User, Calendar } from "lucide-react";
import PostReactions from "./Reactions/PostReactions";
import PostComments from "./Comments/PostComments";

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

        // Set postInfo, defaulting to "Anonymous" if author is not provided
        setPostInfo({
          ...data,
          author: data.author || { username: "Anonymous" },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, api]);

  const showConfirmDialog = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${api}/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete post");
      }
      setRedirect(true);
    } catch (err) {
      setError(err.message);
    } finally {
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
      <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-20 mt-20">
        <p className="text-red-600 dark:text-red-200">{error}</p>
      </div>
    );
  }
  if (!postInfo) return null;

  const isUserAuthorized =
    userInfo?.id === postInfo?.author?._id || userInfo?.username === "admin";

  return (
    <article className="max-w-4xl mx-auto px-4 py-28 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {postInfo.title}
      </h1>

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
            onClick={showConfirmDialog}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Post</span>
          </button>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm mx-auto">
            <p className="text-lg mb-4 dark:text-gray-100">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
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

      <div className="border-t dark:border-gray-800 pt-6">
        <PostReactions postId={postInfo._id} />
      </div>

      <PostComments postId={postInfo._id} />
    </article>
  );
}

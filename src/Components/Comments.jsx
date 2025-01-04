import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, database } from "../Firebase/Setup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Comments(props) {
  const [comments, setComments] = useState("");
  const [allComments, setAllComments] = useState([]);

  // Add a new comment
  const addComments = async () => {
    if (!comments.trim()) {
      toast.warning("Comment cannot be empty!");
      return;
    }

    const newsDoc = doc(database, "News", `${props.url.substr(-10, 10)}`);
    const commentsRef = collection(newsDoc, "Comments");

    try {
      if (auth.currentUser) {
        await addDoc(commentsRef, {
          comments: comments.trim(),
          name: auth.currentUser.displayName || "Anonymous",
          profileImg:
            auth.currentUser.photoURL || "https://via.placeholder.com/50"
        });
        toast.success("Comment added successfully!");
        setComments("");
        showComments();
      } else {
        toast.error("You must be logged in to add a comment!");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment!");
    }
  };

  // Fetch comments from Firestore
  const showComments = async () => {
    const newsDoc = doc(database, "News", `${props.url.substr(-10, 10)}`);
    const commentsRef = collection(newsDoc, "Comments");

    try {
      const data = await getDocs(commentsRef);
      const commentsArray = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllComments(
        commentsArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ) // Sort comments by newest first
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast.error("Failed to fetch comments!");
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      addComments();
    }
  };

  useEffect(() => {
    showComments();
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr]">
      {/* Input Section */}
      <div className="p-5">
        <label
          htmlFor="comment_input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Add Comments
        </label>
        <div className="flex">
          <input
            value={comments}
            onChange={e => setComments(e.target.value)}
            onKeyDown={handleKeyPress}
            type="text"
            id="comment_input"
            className="bg-gray-100 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-black"
            placeholder="Enter your comment"
            maxLength={200}
            required
          />
          <button
            onClick={addComments}
            className="ml-2 bg-gray-100 hover:bg-slate-500 text-gray-900 text-sm py-2 px-4 rounded hover:text-white"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Maximum 200 characters allowed.
        </p>
      </div>

      {/* Comments Section */}
      <div className="p-5 overflow-y-auto max-h-96">
        {allComments.length > 0
          ? <div className="space-y-4">
              {allComments.map(comment => {
                console.log("Profile Image URL:", comment.profileImg); // Log the profile image URL
                return (
                  <div key={comment.id} className="mb-4">
                    <div className="flex items-start">
                      <img
                        src={comment.profileImg}
                        alt="Profile"
                        className="rounded-full border-black-950 border-2 w-10 h-10"
                      />
                      <div className="ml-3">
                        <h3 className="font-semibold text-sm text-slate-600">
                          {comment.name}
                        </h3>
                        <h4 className="text-gray-700">
                          {comment.comments}
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          : <p className="text-gray-500">No comments yet.</p>}
      </div>
      <ToastContainer autoClose={1500} />
    </div>
  );
}

export default Comments;

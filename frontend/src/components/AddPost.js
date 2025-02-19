import axios from "axios";
import { useState } from "react";

const AddPost = () => {
  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Parse the JSON object
  const userId = user?.id || ""; // ✅ Get user ID safely
  const dp = localStorage.getItem("dp");
  const token = localStorage.getItem("token");

  const [desc, setDesc] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null); // ✅ For UI preview

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // ✅ Store actual file
      setPreviewImg(URL.createObjectURL(file)); // ✅ Keep preview for UI
    }
  };

  // Handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); // ✅ Retrieve token
  
    if (!token) {
      alert("User is not authenticated. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("desc", desc);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
  
    try {
      const response = await axios.post("http://localhost:5050/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add token to headers
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("Post created successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error creating post:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Failed to create post.");
    }
  };
  

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      <img
        src={dp || "/noAvatar.png"}
        alt="User Avatar"
        className="h-12 w-12 rounded-full object-cover relative top-3"
      />

      <div className="flex-1 flex flex-col gap-3 text-gray-600">
        <form onSubmit={handleSubmit} className="w-full flex gap-3">
          <textarea
            name="desc"
            placeholder="What's on your mind?"
            className="border-0 p-2 focus:outline-none bg-slate-100 h-16 rounded-lg w-full"
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
            type="submit"
            className="bg-slate-100 w-20 rounded-lg text-blue-500 hover:text-green-500"
          >
            Post
          </button>
        </form>

        {/* Image Upload Section */}
        <div className="flex gap-3 items-center">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImg && <img src={previewImg} alt="Preview" className="h-12 w-12 rounded-lg" />}
        </div>
      </div>
    </div>
  );
};

export default AddPost;

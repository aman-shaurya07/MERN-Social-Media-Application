import React, { useState } from "react";

const StoryList = ({ stories, userId, addStory }) => {
  const [storyList, setStoryList] = useState(stories);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  // Get user details from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Handle Image Selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  // Handle Story Upload
  const handleUpload = async () => {
    if (!selectedImage) return;

    // Add Optimistic Story Preview
    const newStory = {
      id: `${Math.random()}`,
      img: preview,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        username: "Sending...",
        avatar: user?.avatar || "/noAvatar.png",
      },
    };

    setStoryList([newStory, ...storyList]);

    // Simulate Successful Upload
    alert("Story uploaded successfully!");
    setPreview(null);
    setSelectedImage(null);

    // Call Backend API (Uncomment when backend is ready)
    // const uploadedStory = await addStory(preview);
    // setStoryList((prev) => [uploadedStory, ...prev]);
  };

  // Handle Story Click (Open Modal)
  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  return (
    <>
      {/* Upload Story Section */}
      <div className="flex flex-col items-center gap-2 cursor-pointer relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="fileUpload"
        />
        <label htmlFor="fileUpload">
          <img
            src={preview || user?.avatar || "/noAvatar.png"}
            alt="Upload Story"
            className="w-20 h-20 rounded-full ring-2 object-cover cursor-pointer"
          />
        </label>
        {preview ? (
          <button
            onClick={handleUpload}
            className="text-xs bg-blue-500 p-1 rounded-md text-white"
          >
            Send
          </button>
        ) : (
          <span className="font-medium">Add a Story</span>
        )}
        <div className="absolute text-6xl text-gray-200 top-1">+</div>
      </div>

      {/* Display Existing Stories */}
      {storyList.map((story) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          key={story.id}
          onClick={() => handleStoryClick(story)}
        >
          <img
            src={story.user.avatar || "/noAvatar.png"}
            alt="Story"
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">{story.user.name || story.user.username}</span>
        </div>
      ))}

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-sm z-60">
            <img
              src={selectedStory.img}
              alt="Story"
              className="w-full h-auto rounded-lg"
            />
            <button
              className="mt-2 bg-red-500 text-white p-2 rounded"
              onClick={() => setSelectedStory(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryList;

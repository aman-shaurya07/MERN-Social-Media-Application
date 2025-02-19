import React from "react";

const UpdateButton = ({ loading }) => {
  return (
    <button
      className="bg-blue-500 p-2 mt-2 rounded-md text-white disabled:bg-opacity-50 disabled:cursor-not-allowed"
      disabled={loading}
    >
      {loading ? "Updating..." : "Update"}
    </button>
  );
};

export default UpdateButton;

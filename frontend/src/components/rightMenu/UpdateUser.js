import React, { useState } from "react";
import axios from "axios";
import UpdateButton from "./UpdateButton";

const UpdateUser = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(user.cover || "/noCover.png");
  const [formData, setFormData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    description: user.description || "",
    city: user.city || "",
    school: user.school || "",
    work: user.work || "",
    website: user.website || "",
  });

  const [state, setState] = useState({ success: false, error: false });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleClose = () => {
    setOpen(false);
    setState({ success: false, error: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading state

    try {
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("surname", formData.surname);
      updatedData.append("description", formData.description);
      updatedData.append("city", formData.city);
      updatedData.append("school", formData.school);
      updatedData.append("work", formData.work);
      updatedData.append("website", formData.website);
      if (cover) updatedData.append("cover", cover);

      await axios.put(`http://localhost:5050/api/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setState({ success: true, error: false });
    } catch (error) {
      console.error("Error updating profile:", error);
      setState({ success: false, error: true });
    } finally {
      setLoading(false); // ✅ Stop loading state
    }
  };

  return (
    <div>
      <span className="text-blue-500 text-xs cursor-pointer" onClick={() => setOpen(true)}>
        Update
      </span>
      {open && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative">
            {/* TITLE */}
            <h1>Update Profile</h1>

            {/* INPUT FIELDS */}
            {["name", "surname", "description", "city", "school", "work", "website"].map((field) => (
              <div className="flex flex-col gap-4" key={field}>
                <label htmlFor={field} className="text-xs text-gray-500">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  placeholder={formData[field]}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <UpdateButton loading={loading} /> {/* ✅ Pass loading state */}

            {state.success && <span className="text-green-500">Profile has been updated!</span>}
            {state.error && <span className="text-red-500">Something went wrong!</span>}
            <div className="absolute text-xl right-2 top-3 cursor-pointer" onClick={handleClose}>
              X
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;

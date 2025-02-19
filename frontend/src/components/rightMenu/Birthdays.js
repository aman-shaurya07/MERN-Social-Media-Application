import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Birthdays = () => {
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/users/birthdays");
        setBirthdays(response.data);
      } catch (error) {
        console.error("Error fetching birthdays:", error);
      }
    };

    fetchBirthdays();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Birthdays</span>
      </div>
      {/* USERS WITH BIRTHDAYS */}
      {birthdays.length ? (
        birthdays.map((birthday) => (
          <div className="flex items-center justify-between" key={birthday.id}>
            <div className="flex items-center gap-4">
              <img
                src={birthday.avatar || "/default-avatar.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">{birthday.username}</span>
            </div>
            <div className="flex gap-3 justify-end">
              <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                Celebrate
              </button>
            </div>
          </div>
        ))
      ) : (
        <span>No birthdays today!</span>
      )}
      {/* UPCOMING */}
      <div className="p-4 bg-slate-100 rounded-lg flex items-center gap-4">
        <img src="/gift.png" alt="Upcoming Birthdays" width={24} height={24} />
        <Link to="/" className="flex flex-col gap-1 text-xs">
          <span className="text-gray-700 font-semibold">Upcoming Birthdays</span>
          <span className="text-gray-500">
            See who has upcoming birthdays
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Birthdays;

"use client";

import React, { useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import axios from "axios";
import { motion } from "framer-motion";
import { data } from "framer-motion/client";
import { toast, ToastContainer } from "react-toastify";
import { reviewQueastions } from "@/utils/reviewQuestions";
import { BaseUrl } from "@/config/config";

const App = () => {
  const [ratings, setRatings] = useState(reviewQueastions);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentRating, setCurrentRating] = useState(0);
  const [isUserInfoExist, setIsUserInfoExist] = useState(false);
  const [toiletInfo, setToiletInfo] = useState(null);
  const [loaderFlag, setLoderFlag] = useState(true);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState({ name: "", number: "" });

  const getNearestToilet = async () => {
    let lat = "";
    let lang = "";
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        lang = position.coords.longitude;
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    try {
      setLoderFlag(true);
      const data = await axios.get(
        `${BaseUrl}toiletSeva/neaarestToilet?lat=18.591547&lng=73.890193`
      );
      setToiletInfo(data.data.data);
    } catch (error) {
    } finally {
      setLoderFlag(false);
    }
  };

  useEffect(() => {
    setCurrentRating(ratings[currentQuestion].rating);
  }, [currentQuestion]);

  useEffect(() => {
    getNearestToilet();
  }, []);

  const handleRatingChange = (value) => {
    ratings[currentQuestion].rating = value;
    setRatings(ratings);
    setCurrentRating(value);
    if (currentQuestion <= ratings.length - 1)
      setCurrentQuestion((prev) => prev + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    let data = ratings.reduce((acc, item) => {
      acc[item.category] = item.rating;
      return acc;
    }, {});
    try {
      setLoderFlag(true);
      const res = await axios.post(
        `${BaseUrl}toiletSeva/saveToiletSevaReview`,
        {
          ...toiletInfo.nearestToilet,
          name: user.name,
          number: user.number,
          comment: comment,
          ratings: data,
        }
      );
      if (res.status == 200) {
        toast.success(res.data.message);
        setUser({ name: "", number: "" });
        setRatings(reviewQueastions);
        setIsUserInfoExist(false);
        // window.location.reload();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const DynamicIcons = ({ icon }) => {
    let Icon = icon;
    return <Icon size={40} />;
  };

  const handleUserSubmit = () => {
    console.log(user);
    if (!user.name) {
      toast.error("Citizen name is required");
      return;
    }
    if (!user.number || user?.number.length !== 10) {
      toast.error("Citizen number is invalid");
      return;
    }
    setIsUserInfoExist(true);
  };

  return toiletInfo ? (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-gray-300 gap-4 ">
      <h2 className="text-xl font-bold  text-center text-black">{`Feedback Form (${toiletInfo?.nearestToilet?.address})`}</h2>
      <ToastContainer />
      {!isUserInfoExist ? (
        <div className="p-6 shadow-lg rounded-2xl bg-white w-96">
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
              Citizen Details
            </h2>
            <div className="space-y-4">
            <div>
            <label className="block text-gray-600 font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={user.name}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, name: e.target.value }))
                }
                className="p-3 border-2 border-gray-700 rounded-xl w-full text-gray-500"
                required
              />
              </div> 
               <div>
               <label className="block text-gray-600 font-medium mb-1">Number</label>
              <input
                type="tel"
                placeholder="Enter your number"
                value={user.number}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, number: e.target.value }))
                }
                className="p-3 border-2 border-gray-700 rounded-xl w-full text-gray-500"
                required
              />
              </div>
              <button
                onClick={handleUserSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <motion.div
            key={ratings[currentQuestion].label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {currentQuestion < ratings.length - 1 ? (
              <div className="p-4 shadow-2xl rounded-lg bg-white flex flex-col space-y-2 item-center ">
                <div className="bg-blue-600 text-white p-4 w-56 h-44 flex flex-col justify-center items-center">
                  <DynamicIcons icon={ratings[currentQuestion].icon} />
                  <label className="block text-lg font-medium capitalize text-center ">
                    {ratings[currentQuestion].label}
                  </label>
                </div>
                <div className="flex justify-center">
                  <Rating
                    value={currentRating}
                    onChange={(value) => handleRatingChange(value)}
                    style={{ maxWidth: 200, gap: 8 }}
                  />
                </div>
              </div>
            ) : (
              <div className="shadow-2xl rounded-lg bg-white flex flex-col p-4 w-72 h-44 ">
                <label className="block text-lg font-medium capitalize text-gray-700">
                  Comment :
                </label>
                <textarea
                  className="border-2 border-black text-gray-500 p-2"
                  multiple
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}
          </motion.div>

          <div className="flex justify-between items-center mt-4">
            {currentQuestion > 0 ? (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Back
              </button>
            ) : (
              ""
            )}
            <button
              onClick={() =>
                currentQuestion < ratings.length - 1
                  ? setCurrentQuestion((prev) => prev + 1)
                  : handleSubmit()
              }
              // type="submit"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              {currentQuestion < ratings.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-gray-300 text-gray-700  ">
      <h1>No toilets found within 50 meters.</h1>
    </div>
  );
};

export default App;

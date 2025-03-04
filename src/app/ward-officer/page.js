"use client";

import { BaseUrl } from "@/config/config";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Page = () => {
  const [officer, setOfficer] = useState({ empCode: "", number: "" });

  const handleUserSubmit = async () => {
    console.log(officer);
    if (!officer.empCode) {
      toast.error("Employee Code is required");
      return;
    }
    if (!officer.number || officer?.number.length !== 10) {
      toast.error("Employee number is invalid");
      return;
    }
    try {
      const res = await axios.post(
        `${BaseUrl}toiletSeva/getReviewWardWose`,
        officer
      );


      if(!res?.data?.data?.length) {
        toast.warn('No Reviews For your Ward')
        return
      }

      let data = res.data.data?.map(item=>({...item,...item.ratings}));
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "User Reviews");

      // Generate Excel file and convert it to a Blob
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const excelBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Save the file
      saveAs(excelBlob, "UserReviews.xlsx");
      if (res.status == 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
        console.log(error)
      toast.error(error?.response?.data?.message);
    }
    // setIsUserInfoExist(true);
  };

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-gray-300 gap-4 ">
      <div className="p-6 shadow-lg rounded-2xl bg-white w-96">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
            Officer Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Employee Code
              </label>
              <input
                type="text"
                placeholder="Enter your Employee Code"
                value={officer.empCode}
                onChange={(e) =>
                  setOfficer((prev) => ({ ...prev, empCode: e.target.value }))
                }
                className="p-3 border-2 border-gray-700 rounded-xl w-full text-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Number
              </label>
              <input
                type="tel"
                placeholder="Enter your number"
                value={officer.number}
                onChange={(e) =>
                  setOfficer((prev) => ({ ...prev, number: e.target.value }))
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
    </div>
  );
};

export default Page;

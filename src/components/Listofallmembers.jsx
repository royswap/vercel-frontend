import React, { useEffect, useState } from "react";
import {
  gellAllusersBeforDate,
  gellmembersbycom,
  getallcommittees,
} from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function Listofallmembers() {
  const [data, setData] = useState([]);
  const [oldmembers, setOldmembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [conference_name, setConference_name] = useState("");
  const [committees, setCommittees] = useState([]);

  const navigate = useNavigate(); // <-- Initialize navigate

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      getallcommittees(conference_id)
        .then((res) => {
          setCommittees(res.data.committee);
          console.log(res.data.committee);
          setConference_name(res.data.conferenceName);
          // console.log(res.data.conferenceName);
        })
        .catch((err) => {
          console.error(err);
        });
      getoldmembers(); // Call getoldmembers here
    }
  }, []);

  const getoldmembers = () => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      gellAllusersBeforDate(conference_id)
        .then((res) => {
          setData(res.data); // Update the data state variable here
        })
        .catch((err) => {});
    }
  };

  const redirectToHome = () => {
    navigate("/select-conference"); // <-- This will navigate to the select-conference page
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Create a mapping of committee IDs to names
  const committeeMap = {};
  committees.forEach((committee) => {
    committeeMap[committee._id] = committee.committee_name;
  });
  // Debugging: Log the committee map
  console.log("Committee Map:", committeeMap);

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded overflow-auto bg-slate-50">
      {/* Home Icon and Title in One Line */}
      <div className="relative flex items-center">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />
        <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          <u>List of All Members</u>
        </div>
      </div>

      {loading ? (
        <div className="text-2xl text-center mt-4">Loading...</div>
      ) : empty ? (
        <div className="text-2xl text-center mt-4">No Members Found</div>
      ) : (
        <>
          <div className="md:flex justify-between">
            <div className="m-2 md:m-4">
              <h2 className="text-xl md:text-2xl text font-semibold text-black">
                Conference Name : {toSentenceCase(conference_name)}
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Member ID
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Member Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Email
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Mobile
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Committee
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((member) => {
                    // Log the entire member object to inspect the structure
                    console.log("Member Object:", member);

                    return (
                      <tr key={member._id}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                          {member._id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                          {member.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                          {member.email}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                          {member.mobile}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                          {committees.length > 0
                            ? committeeMap[member.committee_id] ||
                              "Unknown Committee"
                            : "Loading..."}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                          {member.role}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Listofallmembers;

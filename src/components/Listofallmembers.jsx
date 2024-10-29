import React, { useEffect, useState } from "react";
import {
  gellAllusersBeforDate,
  getallcommittees,
} from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function Listofallmembers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [conference_name, setConference_name] = useState("");
  const [committees, setCommittees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      setLoading(true);
      getallcommittees(conference_id)
        .then((res) => {
          setCommittees(res.data.committee);
          setConference_name(res.data.conferenceName);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));

      getoldmembers();
    }
  }, []);

  const getoldmembers = () => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      gellAllusersBeforDate(conference_id)
        .then((res) => {
          setData(res.data);
          if (res.data.length === 0) {
            setEmpty(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const redirectToHome = () => {
    navigate("/select-conference");
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

  // Filtered data based on search term
  const filteredData = data.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h2 className="text-xl md:text-2xl font-semibold text-black">
                Conference Name: {toSentenceCase(conference_name)}
              </h2>
            </div>
            <div className="m-2 md:m-4">
              <input
                type="text"
                placeholder="Search by member name..."
                className="border rounded p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-auto" style={{ maxHeight: '400px' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Member ID
                  </th>
                  <th className="whitespace-nowrap px-4 py -2 font-medium text-gray-900">
                    Member Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Email
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Mobile
                  </th>
                  {/* <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Committee
                  </th> */}
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((member) => {
                  console.log("Member:", member); // Log the entire member object

                  // Check for the correct property name for committee ID
                  const committeeId =
                    member.committee_id ||
                    member.committeeId ||
                    member.committeeID ||
                    member.committee; // Modify this line based on the actual property name

                  console.log("Committee ID:", committeeId); // Log the committee ID to see if it's defined

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
                      {/* <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                        {committees.length > 0
                          ? committeeMap[committeeId] || "Unknown Committee"
                          : "Loading..."}
                      </td> */}
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                        {member.role}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Listofallmembers;
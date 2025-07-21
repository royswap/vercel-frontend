import React, { useState, useEffect } from "react";
import {
  getallcommittees,
  gellmembersbycom,
} from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function CommitteewiseMembers() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [conference_name, setConference_name] = useState("");
  const [selectedCommittee, setSelectedCommittee] = useState("");
  const [existingmambers, setExistingmambers] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      getallcommittees(conference_id)
        .then((res) => {
          setCommittees(res.data.committee);
          setConference_name(res.data.conferenceName);
          setMembers(res.data.members);
          setData(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const handleCommitteeChange = (event) => {
    const selectedCommitteeId = event.target.value;
    const selectedCommittee = committees.find(
      (committee) => committee._id === selectedCommitteeId
    );
    setSelectedCommittee({
      id: selectedCommittee._id,
      name: selectedCommittee.committee_name,
    });
    gellmembersbycom(selectedCommitteeId)
      .then((res) => {
        setExistingmambers(res.data);
      })
      .catch((err) => {});
  };

  const handleDeleteClick = (id) => {
    const updatedExistingMembers = existingmambers.filter(
      (member) => member._id !== id
    );
    setExistingmambers(updatedExistingMembers);
  };

  const handleRedirect = () => {
    navigate("/select-conference");
  };

  function redirectToHome() {
    navigate("/select-conference"); // Redirection by home icon
  }

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Added function to format conference name in proper title case
  const toTitleCase = (str) => {
    if (!str) return "";
    const minorWords = ["on", "and", "the", "in", "of", "for", "with"];
    return str
      .toLowerCase()
      .split(" ")
      .map((word, index) => {
        if (word === "ai") return "AI"; // Special case for "AI"
        if (index === 0 || !minorWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(" ");
  };

  // Filtered data based on search term
  const filteredMembers = existingmambers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      existingmambers.map((member) => ({
        Name: toSentenceCase(member.name),
        Email: member.email,
        Role: toSentenceCase(member.role),
        Country: toSentenceCase(member.country),
        Mobile: toSentenceCase(member.mobile),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Committeewise Members");
    XLSX.writeFile(workbook, "Committeewise_Members_Report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Committeewise Members Report", 14, 10);

    const tableColumn = ["Name", "Email", "Role", "Country", "Mobile"];
    const tableRows = existingmambers.map((member) => [
      toSentenceCase(member.name),
      member.email,
      toSentenceCase(member.role),
      toSentenceCase(member.country),
      toSentenceCase(member.mobile),
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("Committeewise_Members_Report.pdf");
  };
  

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50">
      {/* Home Icon */}
      <div className="w-full text-left mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />
      </div>
      {/* Export Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={exportToExcel}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
          Export to Excel
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          Export to PDF
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              Conference ID Missing
            </h2>
            <p className="mb-4">Please select a conference to proceed.</p>
            <button
              onClick={handleRedirect}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Conference Selection
            </button>
          </div>
        </div>
      )}

      {data ? (
        <div>Loading..</div>
      ) : (
        <>
          <div className="m-2 md:m-4 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-semibold text-black">
              Conference Name: {toTitleCase(conference_name)} {/* Updated to use toTitleCase */}
            </h2>
            <input
              type="text"
              placeholder="Search by member name..."
              className="border rounded p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="expectedSubmissions"
              className="block text-2xl font-medium text-gray-700 m-2 md:m-4"
            >
              <span className="text-lg font-medium text-gray-700">
                Select Committee
              </span>
              <select
                id="expectedSubmissions"
                name="expectedSubmissions"
                className="mt-5 block w-half pl-10 pr-20 py-2 text-base bg-gray-200 border border-black focus:ring-blue-500 focus:border-blue-500 sm:text-m rounded-md cursor-pointer"
                required
                value={selectedCommittee?.id || ""}
                onChange={handleCommitteeChange}
              >
                <option value="" disabled>
                  Select an option
                </option>

                {committees.map((committee) => (
                  <option key={committee._id} value={committee._id}>
                    {toSentenceCase(committee.committee_name)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 w-full h-96 border border-3 shadow-sm">
            <div className="text-center text-xl font-semibold">
              <h2>Members For {toSentenceCase(selectedCommittee.name)}</h2>
            </div>
            <div className="mt-2 w-full h-72 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Affiliation
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mobile
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member._id} onClick={() => handleRowClick(member)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {toSentenceCase(member.name)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {toSentenceCase(member.role)}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {toSentenceCase(member.affiliation)}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {toSentenceCase(member.country)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {toSentenceCase(member.mobile)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CommitteewiseMembers;

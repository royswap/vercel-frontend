import React, { useEffect, useState } from "react";
import {
  report_trackwisepaper,
  getalltracks,
  getTrackWisePaper,
} from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function Trackwisepapers() {
  const [data, setData] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState({ id: "", name: "" });
  const [track, setTracks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      getalltracks(conference_id)
        .then((res) => {
          setTracks(res.data.tracks);
          console.log(res.data);
        })
        .catch((err) => {
          console.error("Error fetching tracks:", err);
        });
    } else {
      setShowPopup(true);
    }
  }, []);

  const handleTrackChange = (event) => {
    setLoading(true);
    setEmpty(false); // Reset the empty state when a new track is selected
    console.log(event.target.value);

    getTrackWisePaper(event.target.value)
      .then((res) => {
        if (res.data.length === 0) {
          setEmpty(true); // No data found
        } else {
          setData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response?.status);
        if (err.response?.status === 404) {
          setEmpty(true);
        } else {
          setEmpty(false);
        }
        console.error("Error fetching tracks:", err);
        setLoading(false);
      });
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

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      toSentenceCase(item.title).includes(toSentenceCase(searchTerm)) ||
      toSentenceCase(item.name).includes(toSentenceCase(searchTerm))
  );

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Title: toSentenceCase(item.title),
        "First Author": toSentenceCase(item.name),
        "First Author Email": item.email,
        "First Author Country": toSentenceCase(item.country),
        "Co-authors": toSentenceCase(item.co_authors),
        "Copy right form submitted": item.copy_right_form_submitted,
        "Copy right form, question or upload": item.copy_right_form_question_or_upload,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trackwise List of Papers");
    XLSX.writeFile(workbook, "Trackwise_Papers_Report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Trackwise Papers Report", 14, 10);

    const tableColumn = [
      "Title",
      "First Author",
      "First Author Email",
      "First Author Country",
      "Co-authors",
      "Copy right form submitted",
      "Copy right form, question or upload",
    ];
    const tableRows = data.map((item) => [
      toSentenceCase(item.title),
      toSentenceCase(item.name),
      item.email,
      toSentenceCase(item.country),
      toSentenceCase(item.co_authors),
      item.copy_right_form_submitted,
      item.copy_right_form_question_or_upload,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Trackwise_Papers_Report.pdf");
  };

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-slate-50 rounded overflow-auto">
      {/* Home Icon */}
      <div className="relative flex items-center mb-4">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />

        <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          <u>Trackwise Papers</u>
        </div>
        
        {/* Search Bar */}
        <div className="absolute right-0 mr-4">
          <input
            type="text"
            placeholder="Search by Author Name or Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-2 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
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

      <div className="mb-8">
        <label
          htmlFor="trackSelect"
          className="flex text-2xl font-medium text-gray-700"
        >
          <span className="text-2xl font-medium text-gray-700">
            Select Track Name:
          </span>
          <select
            id="trackSelect"
            // value={selectedTrack}
            onChange={handleTrackChange}
            className="flex w-half pl-10 pr-20 py-2 text-base bg-gray-200 border border-black focus:ring-blue-500 focus:border-blue-500 sm:text-m rounded-md cursor-pointer"
            required
          >
            <option>Select a track</option>
            {track.map((track) => (
              <option key={track._id} value={track._id}>
                {toSentenceCase(track.track_name)}
              </option>
            ))}
          </select>
        </label>
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

      {loading ? (
        <div>Loading...</div>
      ) : empty ? (
        <div>No data...</div>
      ) : filteredData.length > 0 ? (
        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
          {" "}
          {/* Set max height for vertical scrolling */}
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  First Author
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  First Author Email
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  First Author Country
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Co-authors
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Copyright form, question or upload
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Copy right form submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {toSentenceCase(item.title)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {toSentenceCase(item.name)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {item.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {toSentenceCase(item.country)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {toSentenceCase(item.co_authors)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default Trackwisepapers;

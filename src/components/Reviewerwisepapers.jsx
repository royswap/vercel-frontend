import React, { useState, useEffect } from "react";
import {
  gellAllReviewers,
  fetchpaperwithreviewer,
  gellAllreviewersbyconid,
} from "../services/ConferenceServices";
import { createReviewers } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import homeIcon from "../assets/home36.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function Reviewerwisepapers() {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [conference_name, setConference_name] = useState("");
  const [empty, setEmpty] = useState(false);
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // add search query state

  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      fetchpaperwithreviewer(conference_id)
        .then((res) => {
          const papersData = res.data;
          setPapers(papersData);
          console.log(papersData);
          

          // Group papers by reviewers
          const groupedByReviewers = {};
          papersData.forEach((paper) => {
            const reviewersList = paper.reviewers.split(',').map(reviewer => reviewer.trim());
            reviewersList.forEach((reviewer) => {
              if (!groupedByReviewers[reviewer]) {
                groupedByReviewers[reviewer] = [];
              }
              groupedByReviewers[reviewer].push({
                title: paper.paper_title,
                author: paper.name,
                track: paper.track_name,
              });
            });
          });

          setReviewers(groupedByReviewers);
          setConference_name(papersData.conferenceName);
          setData(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const redirectToHome = () => {
    navigate("/select-conference"); // <-- This will navigate to the select-conference page
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredReviewers = Object.entries(reviewers).filter(([reviewer]) => {
    const reviewerName = toSentenceCase(reviewer);
    
    const searchQueryLowercase = searchQuery.toLowerCase();

    return (
      reviewerName.toLowerCase().includes(searchQueryLowercase) 
    );
  });

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredReviewers.map(([reviewer, papers]) => ({
        "Reviewer Name": toSentenceCase(reviewer),
        "Papers": papers.map(paper => paper.title).join(", "),
        "Author": papers.map(paper => paper.author).join(", "),
        "Track": papers.map(paper => paper.track).join(", "),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviewerwise Papers");
    XLSX.writeFile(workbook, "Reviewerwise_Papers_Report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reviewerwise Papers Report", 14, 10);

    const tableColumn = ["Reviewer Name", "Papers", "Author", "Track"];
    const tableRows = filteredReviewers.map(([reviewer, papers,]) => [
      toSentenceCase(reviewer),
      papers.map(paper => paper.title).join(", "),
      papers.map(paper => paper.author).join(", "),
      papers.map(paper => paper.track).join(", "),

    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Reviewerwise_Papers_Report.pdf");
  };


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
          <u>List of Papers Reviewer-wise</u>
        </div>
        {/* Add search bar */}
        <div className="absolute right-0 mr-4">
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search reviewer name"
            className="w-64 pl-2 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
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
        <div className="text-2xl text-center mt-4">Loading...</div>
      ) : empty ? (
        <div className="text-2xl text-center mt-4">No Paper Found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
              {/* <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Reviewer ID</th> */}
                <th className="px-4 py-2 text-left text-gray-900 font-medium">Reviewer Name</th>
                <th className="px-4 py-2 text-left text-gray-900 font-medium">Papers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReviewers.map(([reviewer, papers]) => (
                <tr key={reviewer}>
                  <td className="px-4 py-2 font-medium text-gray-600">
                    {toSentenceCase(reviewer || "N/A")}
                  </td>
                  <td>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-900 font-medium">Title</th>
                          <th className="px-4 py-2 text-left text-gray-900 font-medium">Author</th>
                          <th className="px-4 py-2 text-left text-gray-900 font-medium">Track</th>
                        </tr>
                      </thead>
                      <tbody>
                        {papers.map((paper, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-gray-600">{paper.title}</td>
                            <td className="px-4 py-2 text-gray-600">{paper.author}</td>
                            <td className="px-4 py-2 text-gray-600">{paper.track}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reviewerwisepapers;
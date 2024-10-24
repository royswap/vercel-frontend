import React, { useState, useEffect } from "react";
import {
  gellAllReviewers,
  fetchpaperwithreviewer,
  gellAllreviewersbyconid,
} from "../services/ConferenceServices";
import { createReviewers } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function Reviewerwisepapers() {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [conference_name, setConference_name] = useState("");
  const [empty, setEmpty] = useState(false);
  const [papers, setPapers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      fetchpaperwithreviewer(conference_id)
        .then((res) => {
          setPapers(res.data);
          console.log(res.data);
          setReviewers(res.data.reviewers);
          setConference_name(res.data.conferenceName);
          console.log(res.data.conferenceName);
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
      </div>

      {loading ? (
        <div className="text-2xl text-center mt-4">Loading...</div>
      ) : empty ? (
        <div className="text-2xl text-center mt-4">No Paper Found</div>
      ) : (
        <>
          <div className="md:flex justify-between">
            {/* <div className="m-2 md:m-4">
              <h2 className="text-xl md:text-2xl text font-semibold text-black">
                Conference Name : {toSentenceCase(conference_name)}
              </h2>
            </div> */}
          </div>
          <div className="row">
            <div className="col-12">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Reviewers Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      ID
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Title
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Author
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {papers.map((paper) => (
                    <tr key={paper._id}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                      {toSentenceCase(paper.reviewers)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                        {paper._id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                        {paper.paper_title}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-600">
                        {paper.name}
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

export default Reviewerwisepapers;

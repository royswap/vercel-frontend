import React, { useEffect, useState } from "react";
import {
  report_trackwisepaper,
  getalltracks,
  getTrackWisePaper,
} from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function Trackwisepapers() {
  const [data, setData] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState({ id: "", name: "" });
  const [track, setTracks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  const navigate = useNavigate(); // <-- Initialize navigate

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

  // useEffect(() => {
  //     if (selectedTrack) {
  //         const conference_id = sessionStorage.getItem('con');
  //         report_trackwisepaper(conference_id, selectedTrack).then((res) => {
  //             setData(res.data);
  //             // console.log(res.data);
  //         }).catch((err) => {
  //             console.error('Error fetching track-wise papers:', err);
  //         });
  //     }
  // }, [selectedTrack]);

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
    navigate("/select-conference"); //redirection by home icon
  };

  const toSentenceCase = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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
          className="block text-2xl font-medium text-gray-700"
        >
          <span className="text-2xl font-medium text-gray-700">Select Track Name:</span>
          <select
            id="trackSelect"
            // value={selectedTrack}
            onChange={handleTrackChange}
            className="mt-5 block w-half pl-10 pr-20 py-2 text-base bg-gray-200 border border-black focus:ring-blue-500 focus:border-blue-500 sm:text-m rounded-md cursor-pointer"
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

      {loading ? (
        <div>Loading...</div>
      ) : empty ? (
        <div>No data...</div>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto">
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
              {data.map((item, index) => (
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

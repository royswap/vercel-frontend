import React, { useEffect, useState } from "react";
import {
  createAuthorWork,
  fetchauthorwork,
  withdrawPaper,
  editAuthor
} from "../services/ConferenceServices";
import { useLoaderData } from "react-router-dom";
import { getAllConference } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

const AuthorRegistration = () => {
  const [conferenceList, setConferenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPaper, seteditPaper] = useState(true);
  const [conference, setConference] = useState("");
  const [tracks, setTracks] = useState([]);
  const [trackName, setTrackName] = useState("");
  const [topics, setTopics] = useState([]);
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [country, setCountry] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [googlescId, setGooglescId] = useState("");
  const [orchidId, setOrchidId] = useState("");
  const [title, setTitle] = useState("");
  const [track, setTrack] = useState("");
  const [keywords, setKeywords] = useState("");
  const [abstract, setAbstract] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [completionMessage, setCompletionMessage] = useState("");
  const [topicid, setTopicid] = useState("");
  const [CoAuthors, setCoAuthors] = useState([
    {
      name: "",
      email: "",
      mobile: "",
      affiliation: "",
      country: "",
      isCorresponding: false,
    },
  ]);
  const [selectedTrackId, setSelectedTrackId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [paperId, setPaperId] = useState("");
  const [paperID, setPaperID] = useState("");
  const [isCorrespondingAuthor, setIsCorrespondingAuthor] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    affiliation: "",
    country: "",
    contactNumber: "",
    email: "",
    title: "",
    track: "",
    topicid: "",
    keywords: "",
    abstract: "",
    pdfFile: "",
  });

  const [paperDetails, setPaperDetails] = useState({});

  const defaultTrack =
    paperDetails.track && paperDetails.track.track_name
      ? paperDetails.track.track_name
      : "Select Track";

  const defaultConference =
    paperDetails && paperDetails.conference_title
      ? paperDetails.conference_title
      : "Select Conference";
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    getAllConference()
      .then((res) => {
        console.log(res.data);
        setConferenceList(res.data);
        //setTracks(res.data.tracks);
      })
      .catch(() => {});
  }, []);

  const handleTrackChange = (e) => {
    const ind = e.target.selectedIndex - 1;
    setSelectedTrackId(e.target.value);
    if (ind !== -1) {
      setTopics(tracks[ind].topics);
      setTrack(tracks[ind].track_name);
    } else {
      setTopics([]);
    }
  };

  const clearData = () => {
    setName();
    setEmail();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("gggggg");
    const newErrors = {};

    if (!name) newErrors.name = "Name is required.";
    if (!affiliation) newErrors.affiliation = "Affiliation is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!contactNumber) newErrors.contactNumber = "Contact number is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!title) newErrors.title = "Title is required.";
    if (!track) newErrors.track = "Track is required.";
    if (!keywords) newErrors.keywords = "Keywords are required.";
    if (!abstract) newErrors.abstract = "Abstract is required.";
    if (!pdfFile) newErrors.pdfFile = "PDF file is required.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log("ddd");
      return;
    }

    const coAuthorsData = CoAuthors.map((coAuthor) => ({
      name: coAuthor.name,
      affiliation: coAuthor.affiliation,
      country: coAuthor.country,
      contact_no: coAuthor.mobile,
      email: coAuthor .email,
      isCorrespondingAuthor: coAuthor.isCorresponding,
    }));

    const authorWorkData = {
      name,
      affiliation,
      country,
      contact_no: contactNumber,
      email,
      google_sh_id: googlescId,
      orcid_id: orchidId,
      title,
      keywords,
      abstract,
      co_authors: coAuthorsData,
      isCorrespondingAuthor: isCorrespondingAuthor,
    };

    setLoading(true);
    createAuthorWork(authorWorkData, selectedTrackId, conference._id, pdfFile )
      .then((Response) => {
        // setCompletionMessage(Response.data.message);
        console.log(Response.data);
        setPaperId(Response.data.paper_id);
        setShowPopup(true);
        clearData();
        seteditPaper(false);
      })
      .catch((err) => {
        alert(err.response.data.error);
        console.log(err);
      });
    setLoading(false);
    
    console.log(authorWorkData);
  };

  const handleAddCoAuthor = () => {
    const newCoAuthor = {
      name: "",
      email: "",
      mobile: "",
      affiliation: "",
      country: "",
      googleScholarId: "",
      orchidId: "",
    };
    setCoAuthors([...CoAuthors, newCoAuthor]);
  };

  const handleCoAuthorChange = (index, field, value) => {
    const updatedCoAuthors = [...CoAuthors];
    updatedCoAuthors[index][field] = value;
    setCoAuthors(updatedCoAuthors);
  };

  const handleDeleteCoAuthor = (index) => {
    const updatedCoAuthors = [...CoAuthors];
    updatedCoAuthors.splice(index, 1);
    setCoAuthors(updatedCoAuthors);
  };

  const handleRedirect = () => {
    window.location.reload();
  };

  const handleConferenceChange = (event) => {
    const selectedConferenceId = event.target.value;
    const selectedConferenceData = conferenceList.find(
      (conference) => conference._id == selectedConferenceId
    );
    setConference(selectedConferenceData);
    setTracks(selectedConferenceData.tracks);
    console.log(selectedConferenceData.tracks);
  };

  const redirectToHome = () => {
    navigate("/select-conference"); //redirection by home icon
  };

  const redirectToSearchPaper = () => {
    navigate("/search-paper"); //redirection by button
  };

  const handleGoButtonClick = () => {
    // navigate("/search-paper"); //redirection by button
    fetchauthorwork(paperID)
      .then((Response) => {
        // setCompletionMessage(Response.data.message);
        console.log(Response.data);
        setPaperDetails(Response.data);
        setName(Response.data.name);
        setAffiliation(Response.data.affiliation);
        setCountry(Response.data.country);
        setContactNumber(Response.data.contact_no);
        setEmail(Response.data.email);
        setGooglescId(Response.data.google_sh_id);
        setOrchidId(Response.data.orcid_id);
        setTitle(Response.data.title);
        setKeywords(Response.data.keywords);
        setAbstract(Response.data.abstract);
        seteditPaper(false); // Enable editing
      })
      .catch((err) => {
        console.error("Error fetching paper data:", err);
      })
      .catch(() => {});
  };

  const handleWithdrawButtonClick = () => {
    if (!paperID) {
      alert("Please enter a Paper ID to withdraw.");
      return;
    }
    console.log(paperID);

    // setLoading(true);
    withdrawPaper(paperID)
      .then(() => {
        // Clear form inputs
        // setConferenceName("");
        // setName("");
        // setAffiliation("");
        // setCountry("");
        // setContactNumber("");
        // setEmail("");
        // setTitle("");
        // setPdfFile(null);
        // setPaperID("");
        // setPaperDetails({});
        // setLoading(false);
        alert("Paper withdrawn successfully.");
      })
      .catch(( error) => {
        console.error("Error withdrawing paper:", error);
        setLoading(false);
        alert("An error occurred while withdrawing the paper.");
      });
  };

  const handleFormEdit = (e) => {
    e.preventDefault();

    const coAuthorsData = CoAuthors.map((coAuthor) => ({
      name: coAuthor.name,
      affiliation: coAuthor.affiliation,
      country: coAuthor.country,
      contact_no: coAuthor.mobile,
      email: coAuthor.email,
    }));

    const authorWorkData = {
      name,
      affiliation,
      country,
      contact_no: contactNumber,
      email,
      google_sh_id: googlescId,
      orcid_id: orchidId,
      title,
      keywords,
      abstract,
      co_authors: coAuthorsData,
    };

    console.log("Changed Data:", authorWorkData); // Add this line
    // console.log("Changed Data:", paperID); // Add this line
    // console.log("Changed Data:", selectedTrackId); // Add this line
    // console.log("Changed Data:", conference); // Add this line

    editAuthor(JSON.stringify(authorWorkData), paperID, pdfFile )
      .then((res) => {
        alert("Paper details updated successfully.");
        console.log(res.data);
        seteditPaper(true); // Disable editing
      })
      .catch((err) => {
        console.error("Error updating paper details:", err);
        alert("An error occurred while updating paper details.");
      });
    // console.log(pdfFile);
    
  };

  const handleEditToggle = () => {
    seteditPaper((prev) => !prev);
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50 max-w-5xl mt-5">
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Home Icon */}
            <div className="w-full flex justify-between items-center mb-4">
              <img
                src={homeIcon}
                alt="Home"
                className="w-8 h-8 cursor-pointer"
                onClick={redirectToHome}
              />
            </div>

            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg text-center">
                  <h2 className="text-xl font-semibold mb-4 text-green-600">
                    Your Paper is submitted successfully
                  </h2>
                  <p className="mb-4 text-xl font-medium">
                    <span style={{ color: "red" }}>*</span>Please note your
                    Paper ID for future reference.{paperId}
                  </p>
                  <button
                    onClick={handleRedirect}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Okay
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center text-4xl mb-4">
              <u>Submit Paper and Edit</u>
            </div>

            {/* {completionMessage && (
                <div className="alert alert-success mb-4">
                  {completionMessage}
                </div>
              )} */}

            {paperDetails && !editPaper ? (
              <form onSubmit={handleFormEdit}>
                {/*Ppaer ID Search and Go button*/}
                <label className="block text-gray-700">Paper Id:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="form-input mt-1 block md:w-1/2 lg:w-1/2 border border-gray-300"
                    value={paperID}
                    onChange={(e) => setPaperID(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleGoButtonClick}
                  >
                    Go
                  </button>
                </div>

                {/* Conference */}
                <div className="mb-4">
                  <label className="block text-gray-700">Conference:</label>
                  <select
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.track ? "border-red-500" : ""
                    }`}
                    onChange={handleConferenceChange}
                  >
                    <option value="">
                      {paperDetails && paperDetails.conference_title
                        ? paperDetails.conference_title
                        : "Select Conference"}
                    </option>
                    {conferenceList.map((conferenceItem) => (
                      <option key={conferenceItem._id} value={conferenceItem._id}>
                        {toSentenceCase(conferenceItem.conference_title)}
                      </option>
                    ))}
                  </select>
                  {errors.track && (
                    <p className="text-red-500 text-xs italic">{errors .track}</p>
                  )}
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-gray-700">Name:</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className={`form-input mt-1 block md:w-1/2 lg:w-1/2 border border-gray-300 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      value={toSentenceCase(name)}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label className="ml-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={isCorrespondingAuthor}
                        onChange={(e) =>
                          setIsCorrespondingAuthor(e.target.checked)
                        }
                      />
                      <span className="ml-1">Corresponding Author</span>
                    </label>
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs italic">{errors.name}</p>
                  )}
                </div>
                {/* Affiliation */}
                <div className="mb-4">
                  <label className="block text-gray-700">Affiliation:</label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.affiliation ? "border-red-500" : ""
                    }`}
                    value={toSentenceCase(
                      affiliation
                    )}
                    onChange={(e) => setAffiliation(e.target.value)}
                  ></textarea>
                  {errors.affiliation && (
                    <p className="text-red-500 text-xs italic">
                      {errors.affiliation}
                    </p>
                  )}
                </div>
                {/* Country */}
                <div className="mb-4">
                  <label className="block text-gray-700">Country:</label>
                  <input
                    type="text"
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.country ? "border-red-500" : ""
                    }`}
                    value={toSentenceCase(country)}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs italic">
                      {errors.country}
                    </p>
                  )}
                </div>
                {/* Contact Number */}
                <div className="mb-4">
                  <label className="block text-gray-700">Contact Number:</label>
                  <input
                    type="text"
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.contactNumber ? "border-red-500" : ""
                    }`}
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-xs italic">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs italic">{errors.email}</p>
                  )}
                </div>
                {/* Google Scholar ID */}
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Google Scholar ID (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full border border-gray-300"
                    value={googlescId}
                    onChange={(e) => setGooglescId(e.target.value)}
                  />
                </div>
                {/* ORCID ID */}
                <div className="mb-4">
                  <label className="block text-gray-700">
                    ORCID ID (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full border border-gray-300"
                    value={orchidId}
                    onChange={(e) => setOrchidId(e.target.value)}
                  />
                </div>
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-gray-700">Title:</label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    value={toSentenceCase(title)}
                    onChange={(e) => setTitle(e.target.value)}
                  ></textarea>
                  {errors.title && (
                    <p className="text-red-500 text-xs italic">{errors.title}</p >
                  )}
                </div>
                {/* Track */}
                <div className="mb-4">
                  <label className="block text-gray-700">Track:</label>
                  <select
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.track ? "border-red-500" : ""
                    }`}
                    value={selectedTrackId}
                    onChange={handleTrackChange}
                  >
                    <option value="">
                      {paperDetails.track && paperDetails.track.track_name
                        ? toSentenceCase(paperDetails.track.track_name)
                        : "Select Track"}
                    </option>
                    {tracks.map((trackItem) => (
                      <option key={trackItem._id} value={trackItem._id}>
                        {toSentenceCase(trackItem.track_name)}
                      </option>
                    ))}
                  </select>
                  {errors.track && (
                    <p className="text-red-500 text-xs italic">{errors.track}</p>
                  )}
                </div>
                {/* Topic */}
                {/* <div className="mb-4">
                  <label className="block text-gray-700">Topic:</ label>
                  <select
                    className={`form-select mt-1 block w-full ${errors.topicid ? 'border-red-500' : ''}`}
                    value={topicid}
                    onChange={(e) => setTopicid(e.target.value)}
                  >
                    <option value="">Select Topic</option>
                    {topics.map((topicItem) => (
                      <option key={topicItem.topic_id} value={topicItem.topic_id}>
                        {topicItem.topic_name}
                      </option>
                    ))}
                  </select>
                  {errors.topicid && <p className="text-red-500 text-xs italic">{errors.topicid}</p>}
                </div> */}
                {/* Keywords */}
                <div className="mb-4">
                  <label className="block text-gray-700">Keywords:</label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.keywords ? "border-red-500" : ""
                    }`}
                    value={toSentenceCase(keywords)}
                    onChange={(e) => setKeywords(e.target.value)}
                  ></textarea>
                  {errors.keywords && (
                    <p className="text-red-500 text-xs italic">
                      {errors.keywords}
                    </p>
                  )}
                </div>
                {/* Abstract */}
                <div className="mb-4">
                  <label className="block text-gray-700">Abstract:</label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.abstract ? "border-red-500" : ""
                    }`}
                    value={toSentenceCase(abstract)}
                    onChange={(e) => setAbstract(e.target.value)}
                  ></textarea>
                  {errors.abstract && (
                    <p className="text-red-500 text-xs italic">
                      {errors.abstract}
                    </p>
                  )}
                </div>
                {/* PDF File */}
                <div className="mb-4 flex flex-col">
                  <label className="block text-gray-700">PDF File:</label>
                  {paperDetails.pdfLink && (
                    <div className="mb-2">
                      <a
                        href={paperDetails.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    className={`form-input mt-1 block w-full ${
                      errors.pdfFile ? "border-red-500" : ""
                    }`}
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />
                  {errors.pdfFile && (
                    <p className="text-red-500 text-xs italic">
                      {errors.pdfFile}
                    </p>
                  )}
                </div>
                {/* Co-Authors */}
                <div className="mb-4">
                  <label className="block text-gray-700">Co-Authors:</label>
                  {paperDetails.co_authors
                    ? paperDetails.co_authors.map((coAuthor, index) => (
                        <div key={index} className="flex space-x-4 items-center">
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Name"
                            value={toSentenceCase(coAuthor.name)}
                            onChange={(e) =>
                              handleCoAuthorChange(index, "name", e.target.value)
                            }
                          />
                          <input
                            type="email"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Email"
                            value={coAuthor.email}
                            onChange={(e) =>
                              handleCoAuthorChange(index, "email", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Mobile"
                            value={coAuthor.contact_no}
                            onChange={(e) =>
                              handleCoAuthorChange(
                                index,
                                "mobile",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Affiliation"
                            value={toSentenceCase(coAuthor.affiliation)}
                            onChange={(e) =>
                              handleCoAuthorChange(
                                index,
                                "affiliation",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Country"
                            value={toSentenceCase(coAuthor.country)}
                            onChange={(e) =>
                              handleCoAuthorChange(
                                index,
                                "country",
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            className="bg-red-500 text-white px-5 py-1 rounded"
                            onClick={() => handleDeleteCoAuthor(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    : CoAuthors.map((coAuthor, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex items-center">
                            <input
                              type="text"
                              className="form-input mt-1 block w-full mr-3"
                              placeholder="Name"
                              value={coAuthor.name}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              className="form-input mt-1 block w-full mr-3"
                              placeholder="Email"
                              value={coAuthor.email}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              className="form-input mt-1 block w-full mr-3"
                              placeholder="Mobile"
                              value={coAuthor.mobile}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "mobile",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              className="form-input mt-1 block w-full mr-3"
                              placeholder="Affiliation"
                              value={coAuthor.affiliation}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "affiliation",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              className="form-input mt-1 block w-1/2 mr-3"
                              placeholder="Country"
                              value={coAuthor.country}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "country",
                                  e.target.value
                                )
                              }
                            />
                            <label className="mr-2">
                              <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={coAuthor.isCorresponding}
                                onChange={(e) =>
                                  handleCoAuthorChange(
                                    index,
                                    "isCorresponding",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-1">Corresponding Author</span>
                            </label>
                            <button
                              type="button"
                              className="bg-red-500 text-white px-4 py-2 rounded"
                              onClick={() => handleDeleteCoAuthor(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}

                  <button
                    type="button"
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    onClick={handleAddCoAuthor}
                  >
                    Add Co-Author
                  </button>
                </div>

                <div className="flex justify-center md:space-x-6 md:gap-4">
                  {/* Submit or Edit Button */}
                  <button
                    type="submit"
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    disabled={loading}
                  >
                    Save Changes
                    
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-5 py-1 rounded hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    onClick={handleWithdrawButtonClick}
                  >
                    Withdraw Paper
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleFormSubmit}>
                {/*Ppaer ID Search and Go button*/}
                <label className="block text-gray-700">Paper Id:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="form-input mt-1 block md:w-1/2 lg:w-1/2 border border-gray-300"
                    value={paperID}
                    onChange={(e) => setPaperID(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ml-2 border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500 rounded"
                    onClick={handleGoButtonClick}
                  >
                    Go
                  </button>
                </div>

                {/* Conference */}
                <div className="mb-4">
                  <label className="block text-gray-700">Conference:</label>
                  <select
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.track ? "border-red-500" : ""
                    }`}
                    onChange={handleConferenceChange}
                  >
                    <option value="">
                      {paperDetails && paperDetails.conference_title
                        ? paperDetails.conference_title
                        : "Select Conference"}
                    </option>
                    {conferenceList.map((conferenceItem) => (
                      <option key={conferenceItem._id} value={conferenceItem._id}>
                        {toSentenceCase(conferenceItem.conference_title)}
                      </option>
                    ))}
                  </select>
                  {errors.track && (
                    <p className="text-red-500 text-xs italic">{errors.track}</p>
                  )}
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-gray-700">Name:</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className={`form-input mt-1 block md:w-1/2 lg:w-1/2 border border-gray-300 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label className="ml-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={isCorrespondingAuthor}
                        onChange={(e) =>
                          setIsCorrespondingAuthor(e.target.checked)
                        }
                      />
                      <span className="ml-1">Corresponding Author</span>
                    </label>
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs italic">{errors.name}</p>
                  )}
                </div>
                {/* Affiliation */}
                <div className="mb-4">
                  <label className="block text-gray-700">Affiliation:</label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.affiliation ? "border-red-500" : ""
                    }`}
                    value={
                      affiliation
                    }
                    onChange={(e) => setAffiliation(e.target.value)}
                  ></textarea>
                  {errors.affiliation && (
                    <p className="text-red-500 text-xs italic">
                      {errors.affiliation}
                    </p>
                  )}
                </div>
                {/* Country */}
                <div className="mb-4">
                  <label className="block text-gray-700">Country:</label>
                  <input
                    type="text"
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.country ? "border-red-500" : ""
                    }`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs italic">
                      {errors.country}
                    </p>
                  )}
                </div>
                {/* Contact Number */}
                <div className="mb-4">
                  <label className="block text-gray-700">Contact Number:</label>
                  <input
                    type="text"
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.contactNumber ? "border-red-500" : ""
                    }`}
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-xs italic">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs italic">{errors.email}</p>
                  )}
                </div>
                {/* Google Scholar ID */}
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Google Scholar ID (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full border border-gray-300"
                    value={googlescId}
                    onChange={(e) => setGooglescId(e.target.value)}
                  />
                </div>
                {/* ORCID ID */}
                <div className="mb-4">
                  <label className="block text-gray-700">
                    ORCID ID (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full border border-gray-300"
                    value={orchidId}
                    onChange={(e) => setOrchidId(e.target.value)}
                  />
                </div>
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-gray-700">Title:</label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></textarea>
                  {errors.title && (
                    <p className="text-red-500 text-xs italic">{errors.title}</p>
                  )}
                </div>
                {/* Track */}
                <div className="mb-4">
                  <label className="block text-gray-700">Track:</label>
                  <select
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.track ? "border-red-500" : ""
                    }`}
                    value={selectedTrackId}
                    onChange={handleTrackChange}
                  >
                    <option value="">
                      {paperDetails.track && paperDetails.track.track_name
                        ? toSentenceCase(paperDetails.track.track_name)
                        : "Select Track"}
                    </option>
                    {tracks.map((trackItem) => (
                      <option key={trackItem._id} value={trackItem._id}>
                        {toSentenceCase(trackItem.track_name)}
                      </option>
                    ))}
                  </select>
                  {errors.track && (
                    <p className="text-red-500 text-xs italic">{errors.track}</p>
                  )}
                </div>
                {/* Topic */}
                {/* <div className="mb-4">
                  <label className="block text-gray-700">Topic:</ label>
                  <select
                    className={`form-select mt-1 block w-full ${errors.topicid ? 'border-red-500' : ''}`}
                    value={topicid}
                    onChange={(e) => setTopicid(e.target.value)}
                  >
                    <option value="">Select Topic</option>
                    {topics.map((topicItem) => (
                      <option key={topicItem.topic_id} value={topicItem.topic_id}>
                        {topicItem.topic_name}
                      </option>
                    ))}
                  </select>
                  {errors.topicid && <p className="text-red-500 text-xs italic">{errors.topicid}</p>}
                </div> */}
                {/* Keywords */}
                <div className="mb-4">
                  <label className="block text-gray-700">Keywords:</label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.keywords ? "border-red-500" : ""
                    }`}
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  ></textarea>
                  {errors.keywords && (
                    <p className="text-red-500 text-xs italic">
                      {errors.keywords}
                    </p>
                  )}
                </div>
                {/* Abstract */}
                <div className="mb-4">
                  <label className="block text-gray-700">Abstract:</label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.abstract ? "border-red-500" : ""
                    }`}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                  ></textarea>
                  {errors.abstract && (
                    <p className="text-red-500 text-xs italic">
                      {errors.abstract}
                    </p>
                  )}
                </div>
                {/* PDF File */}
                <div className="mb-4 flex flex-col">
                  <label className="block text-gray-700">PDF File:</label>
                  {paperDetails.pdfLink && (
                    <div className="mb-2">
                      <a
                        href ={paperDetails.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    className={`form-input mt-1 block w-full ${
                      errors.pdfFile ? "border-red-500" : ""
                    }`}
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />
                  {errors.pdfFile && (
                    <p className="text-red-500 text-xs italic">
                      {errors.pdfFile}
                    </p>
                  )}
                </div>
                {/* Co-Authors */}
                <div className="mb-4">
                  <label className="block text-gray-700">Co-Authors:</label>
                  {paperDetails.co_authors
                    ? paperDetails.co_authors.map((coAuthor, index) => (
                        <div key={index} className="flex space-x-4 items-center">
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/ 2 border border-gray-300"
                            placeholder="Name"
                            value={coAuthor.name}
                            onChange={(e) =>
                              handleCoAuthorChange(index, "name", e.target.value)
                            }
                          />
                          <input
                            type="email"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Email"
                            value={coAuthor.email}
                            onChange={(e) =>
                              handleCoAuthorChange(index, "email", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Mobile"
                            value={coAuthor.contact_no}
                            onChange={(e) =>
                              handleCoAuthorChange(
                                index,
                                "mobile",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Affiliation"
                            value={coAuthor.affiliation}
                            onChange={(e) =>
                              handleCoAuthorChange(
                                index,
                                "affiliation",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Country"
                            value={coAuthor.country}
                            onChange={(e) =>
                              handleCoAuthorChange(
                                index,
                                "country",
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            className="bg-red-500 text-white px-5 py-1 rounded"
                            onClick={() => handleDeleteCoAuthor(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    : CoAuthors.map((coAuthor, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex items-center">
                            <input
                              type="text"
                              className="form-input mt-1 block w-full mr-3"
                              placeholder="Name"
                              value={coAuthor.name}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              className="form-input mt-1 block w-full mr-3"
                              placeholder="Email"
                              value={coAuthor.email}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              className="form-input mt-1 block w-full mr-3"
                              placeholder="Mobile"
                              value={coAuthor.mobile}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "mobile",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              className="form-input mt-1 block w-full mr-3"
                              placeholder="Affiliation"
                              value={coAuthor.affiliation}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "affiliation",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              className="form-input mt-1 block w-1/2 mr-3"
                              placeholder="Country"
                              value={coAuthor.country}
                              onChange={(e) =>
                                handleCoAuthorChange(
                                  index,
                                  "country",
                                  e.target.value
                                )
                              }
                            />
                            <label className="mr-2">
                              <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={coAuthor.isCorresponding}
 onChange={(e) =>
                                  handleCoAuthorChange(
                                    index,
                                    "isCorresponding",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-1">Corresponding Author</span>
                            </label>
                            <button
                              type="button"
                              className="border rounded border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                              onClick={() => handleDeleteCoAuthor(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}

                  <button
                    type="button"
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    onClick={handleAddCoAuthor}
                  >
                    Add Co-Author
                  </button>
                </div>

                <div className="flex justify-center md:space-x-6 md:gap-4">
                  {/* Submit or Edit Button */}
                  <button
                    type="submit"
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    disabled={loading}
                  >
                    {loading ? "Submit" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="border border-indigo-600 bg-indigo-600 px-5 py-2 text-sm font-medium rounded bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    onClick={handleWithdrawButtonClick}
                  >
                    Withdraw Paper
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorRegistration;
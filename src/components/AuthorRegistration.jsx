import React, { useEffect, useState } from "react";
import {
  createAuthorWork,
  fetchauthorwork,
  withdrawPaper,
  editAuthor,
} from "../services/ConferenceServices";
import { getAllConference } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

const AuthorRegistration = () => {
  const [conferenceList, setConferenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPaper, seteditPaper] = useState(true);
  const [conference, setConference] = useState(null);
  const [tracks, setTracks] = useState([]);
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
  const [keywordCount, setKeywordCount] = useState(0);
  const [abstract, setAbstract] = useState("");
  const [abstractWordCount, setAbstractWordCount] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
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
    keywords: "",
    abstract: "",
    pdfFile: "",
  });
  const [generalError, setGeneralError] = useState("");

  const [paperDetails, setPaperDetails] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getAllConference()
      .then((res) => {
        console.log("Conference List:", res.data);
        setConferenceList(res.data);
      })
      .catch((err) => {
        console.error("Error fetching conferences:", err);
        setGeneralError("Failed to load conferences. Please try again later.");
      });
  }, []);

  const handleTrackChange = (e) => {
    const ind = e.target.selectedIndex - 1;
    setSelectedTrackId(e.target.value);
    if (ind !== -1 && tracks[ind]) {
      setTopics(tracks[ind].topics || []);
      setTrack(tracks[ind].track_name || "");
    } else {
      setTopics([]);
      setTrack("");
      setSelectedTrackId("");
    }
  };

  const clearData = () => {
    setName("");
    setEmail("");
    setAffiliation("");
    setCountry("");
    setContactNumber("");
    setGooglescId("");
    setOrchidId("");
    setTitle("");
    setTrack("");
    setKeywords("");
    setKeywordCount(0);
    setAbstract("");
    setAbstractWordCount(0);
    setPdfFile(null);
    setCoAuthors([
      {
        name: "",
        email: "",
        mobile: "",
        affiliation: "",
        country: "",
        isCorresponding: false,
      },
    ]);
    setSelectedTrackId("");
    setConference(null);
    setTracks([]);
    setGeneralError("");
    setErrors({});
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePDF = (file) => {
    if (!file) return false;
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return "please upload pdf file only";
    }
    if (file.size > maxSize) {
      return "File size exceeds 5MB limit.";
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPdfFile(null);
      setErrors((prev) => ({ ...prev, pdfFile: "PDF file is required." }));
      return;
    }

    const validationResult = validatePDF(file);
    if (validationResult === true) {
      setPdfFile(file);
      setErrors((prev) => ({ ...prev, pdfFile: "" }));
    } else {
      setPdfFile(null);
      setErrors((prev) => ({ ...prev, pdfFile: validationResult }));
      e.target.value = null; // Clear the file input
    }
  };

  const handleViewPDF = () => {
    if (pdfFile) {
      const fileURL = URL.createObjectURL(pdfFile);
      window.open(fileURL, "_blank");
    }
  };

  const processKeywords = (input) => {
    const cleanedInput = input.replace(/,+/, ",").trim();
    const keywordArray = cleanedInput
      .split(",")
      .map((kw) => kw.trim())
      .filter((kw) => kw);
    return keywordArray;
  };

  const formatKeywordsForSubmission = (keywordArray) => {
    return keywordArray.map((kw) => kw.replace(/\s+/g, "_")).join(",");
  };

  const displayKeywords = (keywords) => {
    return keywords.replace(/_/g, " ");
  };

  const handleKeywordsChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "_").replace(/,+/, ",").trim();
    const keywordArray = processKeywords(value);
    
    setKeywordCount(keywordArray.length);

    if (keywordArray.length > 5) {
      setErrors((prev) => ({
        ...prev,
        keywords: "limited to 5 words, delimited by comma",
      }));
      value = keywordArray.slice(0, 5).join(",");
    } else {
      setErrors((prev) => ({ ...prev, keywords: "" }));
    }

    setKeywords(value);
  };

  const handleAbstractChange = (e) => {
    const value = e.target.value;
    const wordArray = value.trim().split(/\s+/).filter((word) => word);
    setAbstractWordCount(wordArray.length);

    if (wordArray.length > 1000) {
      setErrors((prev) => ({
        ...prev,
        abstract: "limited to 1000 words only",
      }));
      const limitedWords = wordArray.slice(0, 1000).join(" ");
      setAbstract(limitedWords);
      setAbstractWordCount(1000);
    } else {
      setErrors((prev) => ({
        ...prev,
        abstract: value ? "" : "Abstract is required.",
      }));
      setAbstract(value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name) newErrors.name = "Name is required.";
    if (!affiliation) newErrors.affiliation = "Affiliation is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!title) newErrors.title = "Title is required.";
    if (!track) newErrors.track = "Track is required.";
    if (!keywords) newErrors.keywords = "Keywords are required.";
    else {
      const keywordArray = processKeywords(keywords);
      if (keywordArray.length > 5) {
        newErrors.keywords = "limited to 5 words, delimited by comma";
      }
    }
    if (!abstract) newErrors.abstract = "Abstract is required.";
    else {
      const wordArray = abstract.trim().split(/\s+/).filter((word) => word);
      if (wordArray.length > 1000) {
        newErrors.abstract = "limited to 1000 words only";
      }
    }
    if (!pdfFile) newErrors.pdfFile = "PDF file is required.";
    else {
      const pdfValidation = validatePDF(pdfFile);
      if (pdfValidation !== true) newErrors.pdfFile = pdfValidation;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setGeneralError("These fields are mandatory or invalid, please fill up correctly.");
      return;
    }

    if (!conference || !conference._id) {
      setGeneralError("Please select a conference.");
      return;
    }
    if (!selectedTrackId) {
      setGeneralError("Please select a track.");
      return;
    }

    setGeneralError("");

    const coAuthorsData = CoAuthors.map((coAuthor, index) => {
      const coAuthorData = {
        name: coAuthor.name || "",
        affiliation: coAuthor.affiliation || "",
        country: coAuthor.country || "",
        contact_no: coAuthor.mobile || "",
        email: coAuthor.email || "",
        isCorrespondingAuthor: coAuthor.isCorresponding || false,
      };
      if (coAuthor.email && !validateEmail(coAuthor.email)) {
        setGeneralError(`Invalid email format for co-author ${coAuthor.name || `Co-author ${index + 1}`}.`);
        throw new Error("Invalid co-author email");
      }
      return coAuthorData;
    });

    const keywordArray = processKeywords(keywords);
    const formattedKeywords = formatKeywordsForSubmission(keywordArray);
    const authorWorkData = {
      name: name.trim(),
      affiliation: affiliation.trim(),
      country: country.trim(),
      contact_no: contactNumber.trim(),
      email: email.trim(),
      google_sh_id: googlescId.trim(),
      orcid_id: orchidId.trim(),
      title: title.trim(),
      keywords: formattedKeywords,
      abstract: abstract.trim(),
      co_authors: coAuthorsData,
      isCorrespondingAuthor: isCorrespondingAuthor,
    };

    console.log("Submitting data:", {
      authorWorkData,
      selectedTrackId,
      conferenceId: conference._id,
      pdfFile: pdfFile ? pdfFile.name : null,
    });

    setLoading(true);
    try {
      const response = await createAuthorWork(
        authorWorkData,
        selectedTrackId,
        conference._id,
        pdfFile
      );
      console.log("API Response:", response.data);
      const receivedPaperId = response.data.paper_id || "Unknown Paper ID";
      setPaperId(receivedPaperId);
      setShowPopup(true);
      clearData();
      seteditPaper(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      let errorMessage = "Failed to submit paper. Please try again.";
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        errorMessage = err.response.data.error || "Server error occurred.";
      } else if (err.request) {
        console.error("No response received:", err.request);
        errorMessage = "No response from server. Please check your connection.";
      } else {
        console.error("Error details:", err.message);
        errorMessage = err.message;
      }
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoAuthor = () => {
    const newCoAuthor = {
      name: "",
      email: "",
      mobile: "",
      affiliation: "",
      country: "",
      isCorresponding: false,
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
      (conference) => conference._id === selectedConferenceId
    );
    setConference(selectedConferenceData || null);
    setTracks(selectedConferenceData ? selectedConferenceData.tracks : []);
    setSelectedTrackId("");
    setTrack("");
    console.log("Selected Conference:", selectedConferenceData);
  };

  const redirectToHome = () => {
    navigate("/select-conference");
  };

  const handleGoButtonClick = () => {
    if (!paperID) {
      setGeneralError("Please enter a Paper ID to search.");
      return;
    }
    fetchauthorwork(paperID)
      .then((response) => {
        console.log("Fetched Paper Data:", response.data);
        setPaperDetails(response.data);
        setName(response.data.name || "");
        setAffiliation(response.data.affiliation || "");
        setCountry(response.data.country || "");
        setContactNumber(response.data.contact_no || "");
        setEmail(response.data.email || "");
        setGooglescId(response.data.google_sh_id || "");
        setOrchidId(response.data.orcid_id || "");
        setTitle(response.data.title || "");
        const displayedKeywords = response.data.keywords ? displayKeywords(response.data.keywords) : "";
        setKeywords(displayedKeywords);
        const keywordArray = processKeywords(displayedKeywords);
        setKeywordCount(keywordArray.length);
        const fetchedAbstract = response.data.abstract || "";
        setAbstract(fetchedAbstract);
        const wordArray = fetchedAbstract.trim().split(/\s+/).filter((word) => word);
        setAbstractWordCount(wordArray.length);
        seteditPaper(false);
      })
      .catch((err) => {
        console.error("Error fetching paper data:", err);
        setGeneralError("Failed to fetch paper data. Please check the Paper ID.");
      });
  };

  const handleWithdrawButtonClick = () => {
    if (!paperID) {
      setGeneralError("Please enter a Paper ID to withdraw.");
      return;
    }
    withdrawPaper(paperID)
      .then(() => {
        setGeneralError("");
        alert("Paper withdrawn successfully.");
      })
      .catch((error) => {
        console.error("Error withdrawing paper:", error);
        setGeneralError("An error occurred while withdrawing the paper.");
      });
  };

  const handleFormEdit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!name) newErrors.name = "Name is required.";
    if (!affiliation) newErrors.affiliation = "Affiliation is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!title) newErrors.title = "Title is required.";
    if (!track) newErrors.track = "Track is required.";
    if (!keywords) newErrors.keywords = "Keywords are required.";
    else {
      const keywordArray = processKeywords(keywords);
      if (keywordArray.length > 5) {
        newErrors.keywords = "limited to 5 words, delimited by comma";
      }
    }
    if (!abstract) newErrors.abstract = "Abstract is required.";
    else {
      const wordArray = abstract.trim().split(/\s+/).filter((word) => word);
      if (wordArray.length > 1000) {
        newErrors.abstract = "limited to 1000 words only";
      }
    }
    if (!paperDetails.pdfLink && !pdfFile) {
      newErrors.pdfFile = "PDF file is required.";
    } else if (pdfFile) {
      const pdfValidation = validatePDF(pdfFile);
      if (pdfValidation !== true) newErrors.pdfFile = pdfValidation;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setGeneralError("These fields are mandatory or invalid, please fill up correctly.");
      return;
    }

    setGeneralError("");

    const coAuthorsData = CoAuthors.map((coAuthor) => ({
      name: coAuthor.name || "",
      affiliation: coAuthor.affiliation || "",
      country: coAuthor.country || "",
      contact_no: coAuthor.mobile || "",
      email: coAuthor.email || "",
      isCorrespondingAuthor: coAuthor.isCorresponding || false,
    }));

    const keywordArray = processKeywords(keywords);
    const formattedKeywords = formatKeywordsForSubmission(keywordArray);
    const authorWorkData = {
      name: name.trim(),
      affiliation: affiliation.trim(),
      country: country.trim(),
      contact_no: contactNumber.trim(),
      email: email.trim(),
      google_sh_id: googlescId.trim(),
      orcid_id: orchidId.trim(),
      title: title.trim(),
      keywords: formattedKeywords,
      abstract: abstract.trim(),
      co_authors: coAuthorsData,
    };

    console.log("Editing data:", authorWorkData);

    editAuthor(JSON.stringify(authorWorkData), paperID, pdfFile)
      .then((res) => {
        setGeneralError("");
        alert("Paper details updated successfully.");
        console.log("Edit Response:", res.data);
        seteditPaper(true);
      })
      .catch((err) => {
        console.error("Error updating paper details:", err);
        setGeneralError("An error occurred while updating paper details.");
      });
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
                    <span className="text-red-500">*</span>Please note your
                    Paper ID for future reference: {paperId}
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

            {generalError && (
              <div className="alert alert-danger mb-4 text-center text-red-500 font-semibold">
                {generalError}
              </div>
            )}

            {paperDetails && !editPaper ? (
              <form onSubmit={handleFormEdit}>
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
                      <option
                        key={conferenceItem._id}
                        value={conferenceItem._id}
                      >
                        {toSentenceCase(conferenceItem.conference_title)}
                      </option>
                    ))}
                  </select>
                  {errors.track && (
                    <p className="text-red-500 text-xs italic">
                      {errors.track}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Name:<span className="text-red-500">*</span>
                  </label>
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
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Affiliation:<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.affiliation ? "border-red-500" : ""
                    }`}
                    value={toSentenceCase(affiliation)}
                    onChange={(e) => setAffiliation(e.target.value)}
                  ></textarea>
                  {errors.affiliation && (
                    <p className="text-red-500 text-xs italic">
                      {errors.affiliation}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Country:<span className="text-red-500">*</span>
                  </label>
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
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Email:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs italic">
                      {errors.email}
                    </p>
                  )}
                </div>
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
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Title:<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    value={toSentenceCase(title)}
                    onChange={(e) => setTitle(e.target.value)}
                  ></textarea>
                  {errors.title && (
                    <p className="text-red-500 text-xs italic">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Track:<span className="text-red-500">*</span>
                  </label>
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
                        : "Select Track"}
                    </option>
                    {tracks.map((trackItem) => (
                      <option key={trackItem._id} value={trackItem._id}>
                        {toSentenceCase(trackItem.track_name)}
                      </option>
                    ))}
                  </select>
                  {errors.track && (
                    <p className="text-red-500 text-xs italic">
                      {errors.track}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Keywords <span className="text-red-500">* (Limited to 5 words, delimited by comma)</span>
                  </label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.keywords ? "border-red-500" : ""
                    }`}
                    value={keywords}
                    onChange={handleKeywordsChange}
                    placeholder="e.g., machine_learning,data_science,apple"
                  ></textarea>
                  <div className="mt-1 text-sm text-gray-600">
                    {keywordCount}/5 keywords
                  </div>
                  {errors.keywords && (
                    <p className="text-red-500 text-xs italic">
                      {errors.keywords}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Abstract <span className="text-red-500">* (Limited to 1000 words, delimited by space)</span>
                  </label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.abstract ? "border-red-500" : ""
                    }`}
                    value={toSentenceCase(abstract)}
                    onChange={handleAbstractChange}
                  ></textarea>
                  <div className="mt-1 text-sm text-gray-600">
                    {abstractWordCount}/1000 words
                  </div>
                  {errors.abstract && (
                    <p className="text-red-500 text-xs italic">
                      {errors.abstract}
                    </p>
                  )}
                </div>
                <div className="mb-4 flex flex-col">
                  <label className="block text-gray-700">
                    PDF File:{!paperDetails.pdfLink && <span className="text-red-500">*</span>}
                  </label>
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
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="application/pdf"
                      className={`form-input mt-1 block w-full ${
                        errors.pdfFile ? "border-red-500" : ""
                      }`}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      className={`mt-1 px-4 py-2 text-sm font-medium rounded ${
                        pdfFile
                          ? "bg-blue-500 text-white hover:bg-blue-700"
                          : "bg-gray-400 text-gray-700 cursor-not-allowed"
                      }`}
                      onClick={handleViewPDF}
                      disabled={!pdfFile}
                    >
                      View PDF
                    </button>
                  </div>
                  {errors.pdfFile && (
                    <p className="text-red-500 text-xs italic">
                      {errors.pdfFile}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Co-Authors:</label>
                  {paperDetails.co_authors
                    ? paperDetails.co_authors.map((coAuthor, index) => (
                        <div
                          key={index}
                          className="flex space-x-4 items-center mb-2"
                        >
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
                            placeholder="Name"
                            value={toSentenceCase(coAuthor.name)}
                            onChange={(e) =>
                              handleCoAuthorChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="email"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
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
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              className="form-input mt-1 block w-full"
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
                              className="form-input mt-1 block w-full"
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
                              className="form-input mt-1 block w-full"
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
                              className="form-input mt-1 block w-full"
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
                              className="form-input mt-1 block w-1/2"
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
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    onClick={handleAddCoAuthor}
                  >
                    Add Co-Author
                  </button>
                </div>

                <div className="flex justify-center space-x-6 gap-4">
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
                    className={`ml-2 px-7 py-2 text-sm font-medium rounded ${
                      paperID
                        ? "border border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border border-gray-400 bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                    onClick={handleGoButtonClick}
                    disabled={!paperID}
                  >
                    Go
                  </button>
                </div>

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
                      <option
                        key={conferenceItem._id}
                        value={conferenceItem._id}
                      >
                        {toSentenceCase(conferenceItem.conference_title)}
                      </option>
                    ))}
                  </select>
                  {errors.track && (
                    <p className="text-red-500 text-xs italic">
                      {errors.track}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Name:<span className="text-red-500">*</span>
                  </label>
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
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Affiliation:<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.affiliation ? "border-red-500" : ""
                    }`}
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                  ></textarea>
                  {errors.affiliation && (
                    <p className="text-red-500 text-xs italic">
                      {errors.affiliation}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Country:<span className="text-red-500">*</span>
                  </label>
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
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Email:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs italic">
                      {errors.email}
                    </p>
                  )}
                </div>
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
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Title:<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></textarea>
                  {errors.title && (
                    <p className="text-red-500 text-xs italic">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Track:<span className="text-red-500">*</span>
                  </label>
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
                        : "Select Track"}
                    </option>
                    {tracks.map((trackItem) => (
                      <option key={trackItem._id} value={trackItem._id}>
                        {toSentenceCase(trackItem.track_name)}
                      </option>
                    ))}
                  </select>
                  {errors.track && (
                    <p className="text-red-500 text-xs italic">
                      {errors.track}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Keywords <span className="text-red-500">* (Limited to 5 words, delimited by comma)</span>
                  </label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.keywords ? "border-red-500" : ""
                    }`}
                    value={keywords}
                    onChange={handleKeywordsChange}
                    placeholder="e.g., machine_learning,data_science,apple"
                  ></textarea>
                  <div className="mt-1 text-sm text-gray-600">
                    {keywordCount}/5 keywords
                  </div>
                  {errors.keywords && (
                    <p className="text-red-500 text-xs italic">
                      {errors.keywords}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Abstract <span className="text-red-500">* (Limited to 1000 words, delimited by space)</span>
                  </label>
                  <textarea
                    className={`form-input mt-1 block w-full border border-gray-300 ${
                      errors.abstract ? "border-red-500" : ""
                    }`}
                    value={abstract}
                    onChange={handleAbstractChange}
                  ></textarea>
                  <div className="mt-1 text-sm text-gray-600">
                    {abstractWordCount}/1000 words
                  </div>
                  {errors.abstract && (
                    <p className="text-red-500 text-xs italic">
                      {errors.abstract}
                    </p>
                  )}
                </div>
                <div className="mb-4 flex flex-col">
                  <label className="block text-gray-700">
                    PDF File:<span className="text-red-500">*</span>
                  </label>
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
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="application/pdf"
                      className={`form-input mt-1 block w-full ${
                        errors.pdfFile ? "border-red-500" : ""
                      }`}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      className={`mt-1 px-4 py-2 text-sm font-medium rounded ${
                        pdfFile
                          ? "bg-blue-500 text-white hover:bg-blue-700"
                          : "bg-gray-400 text-gray-700 cursor-not-allowed"
                      }`}
                      onClick={handleViewPDF}
                      disabled={!pdfFile}
                    >
                      View PDF
                    </button>
                  </div>
                  {errors.pdfFile && (
                    <p className="text-red-500 text-xs italic">
                      {errors.pdfFile}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Co-Authors:</label>
                  {paperDetails.co_authors
                    ? paperDetails.co_authors.map((coAuthor, index) => (
                        <div
                          key={index}
                          className="flex space-x-4 items-center mb-2"
                        >
                          <input
                            type="text"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
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
                            type="email"
                            className="form-input mt-1 block w-1/2 border border-gray-300"
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
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              className="form-input mt-1 block w-full"
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
                              className="form-input mt-1 block w-full"
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
                              className="form-input mt-1 block w-full"
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
                              className="form-input mt-1 block w-full"
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
                              className="form-input mt-1 block w-1/2"
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
                              className="border rounded border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                              onClick={() => handleDeleteCoAuthor(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}

                  <button
                    type="button"
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    onClick={handleAddCoAuthor}
                  >
                    Add Co-Author
                  </button>
                </div>

                <div className="flex justify-center space-x-6 gap-4">
                  <button
                    type="submit"
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  {paperID && (
                    <button
                      type="button"
                      className="border border-indigo-600 bg-indigo-600 px-5 py-2 text-sm font-medium rounded bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                      onClick={handleWithdrawButtonClick}
                    >
                      Withdraw Paper
                    </button>
                  )}
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

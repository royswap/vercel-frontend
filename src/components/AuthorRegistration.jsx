import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createAuthorWork,
  fetchauthorwork,
  withdrawPaper,
  editAuthor,
  getalltracks, // Added import for fetching tracks
} from "../services/ConferenceServices";
import homeIcon from "../assets/home36.png";

const AuthorRegistration = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [editPaper, seteditPaper] = useState(false);
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
  const [keywordsWordCount, setKeywordsWordCount] = useState(0);
  const [abstractWordCount, setAbstractWordCount] = useState(0);
  const [keywordsLimitError, setKeywordsLimitError] = useState(false);
  const [abstractLimitError, setAbstractLimitError] = useState(false);
  const [pdfFileTypeError, setPdfFileTypeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataLoading, setDataLoading] = useState(true); // Added state for loading tracks

  const [paperDetails, setPaperDetails] = useState({});

  const defaultTrack =
    paperDetails.track && paperDetails.track.track_name
      ? paperDetails.track.track_name
      : "Select Track";

  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      console.log("errorMessage updated to:", errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    console.log("Component re-rendered, errorMessage is:", errorMessage);
  });

  useEffect(() => {
    const conference_id = sessionStorage.getItem('con');
    if (conference_id) {
      // Fetch tracks for the current conference
      getalltracks(conference_id)
        .then((res) => {
          setTracks(res.data.tracks || []); // Populate tracks state
          setDataLoading(false); // Set loading to false after fetching
        })
        .catch((err) => {
          console.error("Error fetching tracks:", err);
          setDataLoading(false);
        });
    } else {
      setDataLoading(false);
      setShowPopup(true); // Show popup if no conference_id
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('savedFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setName(parsedData.name || "");
      setAffiliation(parsedData.affiliation || "");
      setCountry(parsedData.country || "");
      setContactNumber(parsedData.contactNumber || "");
      setEmail(parsedData.email || "");
      setGooglescId(parsedData.googlescId || "");
      setOrchidId(parsedData.orchidId || "");
      setTitle(parsedData.title || "");
      setTrack(parsedData.track || "");
      setSelectedTrackId(parsedData.selectedTrackId || "");
      setKeywords(parsedData.keywords || "");
      setAbstract(parsedData.abstract || "");
      setCoAuthors(parsedData.CoAuthors || [
        {
          name: "",
          email: "",
          mobile: "",
          affiliation: "",
          country: "",
          isCorresponding: false,
        },
      ]);
      setIsCorrespondingAuthor(parsedData.isCorrespondingAuthor || false);
      setKeywordsWordCount(countWords(parsedData.keywords || ""));
      setAbstractWordCount(countWords(parsedData.abstract || ""));
    }
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

  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    setKeywords(value);
    const wordCount = countWords(value);
    setKeywordsWordCount(wordCount);
    setKeywordsLimitError(wordCount > 5);
    if (errors.keywords && wordCount <= 5) {
      setErrors((prev) => ({ ...prev, keywords: "" }));
    }
  };

  const handleAbstractChange = (e) => {
    const value = e.target.value;
    setAbstract(value);
    const wordCount = countWords(value);
    setAbstractWordCount(wordCount);
    setAbstractLimitError(wordCount > 1000);
    if (errors.abstract && wordCount <= 1000) {
      setErrors((prev) => ({ ...prev, abstract: "" }));
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'pdf') {
        setPdfFileTypeError(true);
        setPdfFile(null);
        setErrors((prev) => ({ ...prev, pdfFile: "Please upload a PDF file only." }));
      } else {
        setPdfFileTypeError(false);
        setPdfFile(file);
        setErrors((prev) => ({ ...prev, pdfFile: "" }));
      }
    } else {
      setPdfFileTypeError(false);
      setPdfFile(null);
    }
  };

  const handleViewPDF = () => {
    if (pdfFile) {
      const fileURL = URL.createObjectURL(pdfFile);
      window.open(fileURL, "_blank");
    }
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
    if (keywordsWordCount > 5) newErrors.keywords = "Keywords exceed 5 words.";
    if (abstractWordCount > 1000) newErrors.abstract = "Abstract exceeds 1000 words.";
    if (pdfFileTypeError) newErrors.pdfFile = "Please upload a PDF file only.";

    const mandatoryFieldsMissing = !name || !affiliation || !country || !email || !title || !track || !keywords || !abstract || !pdfFile;
    if (mandatoryFieldsMissing) {
      setTimeout(() => {
        setErrorMessage("Mandatory fields are required");
      }, 0);
      setErrors(newErrors);
      return;
    } else {
      setTimeout(() => {
        setErrorMessage("");
      }, 0);
      setErrors(newErrors);
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("ddd");
      return;
    }

    const coAuthorsData = CoAuthors.map((coAuthor) => ({
      name: coAuthor.name,
      affiliation: coAuthor.affiliation,
      country: coAuthor.country,
      contact_no: coAuthor.mobile,
      email: coAuthor.email,
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
    createAuthorWork(authorWorkData, selectedTrackId, pdfFile)
      .then((Response) => {
        console.log(Response.data);
        setPaperId(Response.data.paper_id);
        setShowPopup(true);
        clearData();
        seteditPaper(true);
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

  const redirectToHome = () => {
    navigate("/select-conference");
  };

  const handleGoButtonClick = () => {
    fetchauthorwork(paperID)
      .then((Response) => {
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
        seteditPaper(true);
        setKeywordsWordCount(countWords(Response.data.keywords));
        setAbstractWordCount(countWords(Response.data.abstract));
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

    withdrawPaper(paperID)
      .then(() => {
        alert("Paper withdrawn successfully.");
      })
      .catch((error) => {
        console.error("Error withdrawing paper:", error);
        setLoading(false);
        alert("An error occurred while withdrawing the paper.");
      });
  };

  const handleFormEdit = (e) => {
    e.preventDefault();

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
    if (keywordsWordCount > 5) newErrors.keywords = "Keywords exceed 5 words.";
    if (abstractWordCount > 1000) newErrors.abstract = "Abstract exceeds 1000 words.";
    if (pdfFileTypeError) newErrors.pdfFile = "Please upload a PDF file only.";

    const mandatoryFieldsMissing = !name || !affiliation || !country || !email || !title || !track || !keywords || !abstract || (paperDetails.pdfLink ? false : !pdfFile);
    if (mandatoryFieldsMissing) {
      setTimeout(() => {
        setErrorMessage("Mandatory fields are required");
      }, 0);
      setErrors(newErrors);
      return;
    } else {
      setTimeout(() => {
        setErrorMessage("");
      }, 0);
      setErrors(newErrors);
    }

    if (Object.keys(newErrors).length > 0) {
      return;
    }

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

    console.log("Changed Data:", authorWorkData);

    editAuthor(JSON.stringify(authorWorkData), paperID, pdfFile)
      .then((res) => {
        alert("Paper details updated successfully.");
        console.log(res.data);
        seteditPaper(true);
      })
      .catch((err) => {
        console.error("Error updating paper details:", err);
        alert("An error occurred while updating paper details.");
      });
  };

  const handleSave = () => {
    const formData = {
      name,
      affiliation,
      country,
      contactNumber,
      email,
      googlescId,
      orchidId,
      title,
      track,
      selectedTrackId,
      keywords,
      abstract,
      CoAuthors,
      isCorrespondingAuthor,
      pdfFileName: pdfFile ? pdfFile.name : null,
    };
    localStorage.setItem('savedFormData', JSON.stringify(formData));
    alert('Form data saved successfully!');
  };

  const handleEditToggle = () => {
    seteditPaper((prev) => !prev);
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
                  <h2 className="text-xl font-semibold mb-4 text-red-600">
                    Conference ID Missing
                  </h2>
                  <p className="mb-4 text-xl font-medium">
                    Please select a conference to proceed.
                  </p>
                  <button
                    onClick={handleRedirect}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Go to Conference Selection
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center text-4xl mb-4">
              <div className="text-center">
                <u className="text-4xl">Submit Paper and Edit</u>
              </div>
            </div>

            {errorMessage && (
              <div
                className="text-red-500 text-center mb-4"
                style={{ color: "red", fontWeight: "bold" }}
              >
                {errorMessage}
              </div>
            )}

            {dataLoading ? (
              <div className="text-center">Loading tracks...</div>
            ) : (
              <>
                {paperDetails && !editPaper ? (
                  <form onSubmit={handleFormEdit}>
                    <label className="block text-gray-700">Paper Id:</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="form-input mt-1 block md:w-1/2 lg:w-1/2 border border-gray-300"
                        value={paperID}
                        onChange={(e) => setPaperID(e.target.value)}
                        disabled={editPaper}
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
                      <label className="block text-gray-700">
                        Name: <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          className={`form-input mt-1 block md:w-1/2 lg:w-1/2 border border-gray-300 ${
                            errors.name ? "border-red-500" : ""
                          }`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={editPaper}
                        />
                        <label className="ml-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={isCorrespondingAuthor}
                            onChange={(e) =>
                              setIsCorrespondingAuthor(e.target.checked)
                            }
                            disabled={editPaper}
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
                        Affiliation: <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.affiliation ? "border-red-500" : ""
                        }`}
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value)}
                        disabled={editPaper}
                      ></textarea>
                      {errors.affiliation && (
                        <p className="text-red-500 text-xs italic">
                          {errors.affiliation}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Country: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.country ? "border-red-500" : ""
                        }`}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={editPaper}
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
                        disabled={editPaper}
                      />
                      {errors.contactNumber && (
                        <p className="text-red-500 text-xs italic">
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Email: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={editPaper}
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
                        disabled={editPaper}
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
                        disabled={editPaper}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Title: <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.title ? "border-red-500" : ""
                        }`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={editPaper}
                      ></textarea>
                      {errors.title && (
                        <p className="text-red-500 text-xs italic">
                          {errors.title}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Track: <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.track ? "border-red-500" : ""
                        }`}
                        value={selectedTrackId}
                        onChange={handleTrackChange}
                        disabled={editPaper}
                      >
                        <option value="">
                          {paperDetails.track && paperDetails.track.track_name
                            ? paperDetails.track.track_name
                            : "Select Track"}
                        </option>
                        {tracks.map((trackItem) => (
                          <option key={trackItem._id} value={trackItem._id}>
                            {trackItem.track_name}
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
                        Keywords: <span className="text-red-500">*</span> <span className="text-red-500 text-xs">(Limited to 5 words)</span>
                      </label>
                      <textarea
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.keywords || keywordsLimitError ? "border-red-500" : ""
                        }`}
                        value={keywords}
                        onChange={handleKeywordsChange}
                        disabled={editPaper}
                      ></textarea>
                      {keywordsLimitError && (
                        <p className="text-red-500 text-xs italic">
                          Word limit exceeded (max 5 words)
                        </p>
                      )}
                      {errors.keywords && !keywordsLimitError && (
                        <p className="text-red-500 text-xs italic">
                          {errors.keywords}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Abstract: <span className="text-red-500">*</span> <span className="text-red-500 text-xs">(Limited to 1000 words)</span>
                      </label>
                      <textarea
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.abstract || abstractLimitError ? "border-red-500" : ""
                        }`}
                        value={abstract}
                        onChange={handleAbstractChange}
                        disabled={editPaper}
                      ></textarea>
                      {abstractLimitError && (
                        <p className="text-red-500 text-xs italic">
                          Word limit exceeded (max 1000 words)
                        </p>
                      )}
                      {errors.abstract && !abstractLimitError && (
                        <p className="text-red-500 text-xs italic">
                          {errors.abstract}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 flex flex-col">
                      <label className="block text-gray-700">
                        PDF File only: <span className="text-red-500">*</span>
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
                          className={`form-input mt-1 block w-full ${
                            errors.pdfFile || pdfFileTypeError ? "border-red-500" : ""
                          }`}
                          onChange={handlePdfFileChange}
                          disabled={editPaper}
                        />
                        {pdfFile && !editPaper && (
                          <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleViewPDF}
                          >
                            View PDF
                          </button>
                        )}
                      </div>
                      {pdfFileTypeError && (
                        <p className="text-red-500 text-xs italic">
                          Please upload a PDF file only.
                        </p>
                      )}
                      {errors.pdfFile && !pdfFileTypeError && (
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
                              className="flex space-x-4 items-center"
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
                                disabled={editPaper}
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
                                disabled={editPaper}
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
                                disabled={editPaper}
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
                                disabled={editPaper}
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
                                disabled={editPaper}
                              />
                              <button
                                type="button"
                                className="bg-red-500 text-white px-5 py-1 rounded"
                                onClick={() => handleDeleteCoAuthor(index)}
                                disabled={editPaper}
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
                                  disabled={editPaper}
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
                                  disabled={editPaper}
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
                                  disabled={editPaper}
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
                                  disabled={editPaper}
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
                                  disabled={editPaper}
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
                                    disabled={editPaper}
                                  />
                                  <span className="ml-1">Corresponding Author</span>
                                </label>
                                <button
                                  type="button"
                                  className="bg-red-500 text-white px-4 py-2 rounded"
                                  onClick={() => handleDeleteCoAuthor(index)}
                                  disabled={editPaper}
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
                        disabled={editPaper}
                      >
                        Add Co-Author
                      </button>
                    </div>

                    <div className="flex justify-center md:space-x-6 md:gap-4">
                      <button
                        type="submit"
                        className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                        disabled={loading}
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                        onClick={handleEditToggle}
                      >
                        {editPaper ? "Edit" : "Cancel Edit"}
                      </button>
                      <button
                        type="button"
                        className="bg-red-5 00 text-white px-5 py-1 rounded hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
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
                        disabled={editPaper}
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
                      <label className="block text-gray-700">
                        Name: <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          className={`form-input mt-1 block md:w-1/2 lg:w-1/2 border border-gray-300 ${
                            errors.name ? "border-red-500" : ""
                          }`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={editPaper}
                        />
                        <label className="ml-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={isCorrespondingAuthor}
                            onChange={(e) =>
                              setIsCorrespondingAuthor(e.target.checked)
                            }
                            disabled={editPaper}
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
                        Affiliation: <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.affiliation ? "border-red-500" : ""
                        }`}
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value)}
                        disabled={editPaper}
                      ></textarea>
                      {errors.affiliation && (
                        <p className="text-red-500 text-xs italic">
                          {errors.affiliation}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Country: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.country ? "border-red-500" : ""
                        }`}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={editPaper}
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs italic">{errors.country}</p>
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
                        disabled={editPaper}
                      />
                      {errors.contactNumber && (
                        <p className="text-red-500 text-xs italic">
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Email: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={editPaper}
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
                        disabled={editPaper}
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
                        disabled={editPaper}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Title: <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.title ? "border-red-500" : ""
                        }`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={editPaper}
                      ></textarea>
                      {errors.title && (
                        <p className="text-red-500 text-xs italic">
                          {errors.title}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Track: <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.track ? "border-red-500" : ""
                        }`}
                        value={selectedTrackId}
                        onChange={handleTrackChange}
                        disabled={editPaper}
                      >
                        <option value="">
                          {paperDetails.track && paperDetails.track.track_name
                            ? paperDetails.track.track_name
                            : "Select Track"}
                        </option>
                        {tracks.map((trackItem) => (
                          <option key={trackItem._id} value={trackItem._id}>
                            {trackItem.track_name}
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
                        Keywords: <span className="text-red-500">*</span> <span className="text-red-500 text-xs">(Limited to 5 words)</span>
                      </label>
                      <textarea
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.keywords || keywordsLimitError ? "border-red-500" : ""
                        }`}
                        value={keywords}
                        onChange={handleKeywordsChange}
                        disabled={editPaper}
                      ></textarea>
                      {keywordsLimitError && (
                        <p className="text-red-500 text-xs italic">
                          Word limit exceeded (max 5 words)
                        </p>
                      )}
                      {errors.keywords && !keywordsLimitError && (
                        <p className="text-red-500 text-xs italic">
                          {errors.keywords}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Abstract: <span className="text-red-500">*</span> <span className="text-red-500 text-xs">(Limited to 1000 words)</span>
                      </label>
                      <textarea
                        className={`form-input mt-1 block w-full border border-gray-300 ${
                          errors.abstract || abstractLimitError ? "border-red-500" : ""
                        }`}
                        value={abstract}
                        onChange={handleAbstractChange}
                        disabled={editPaper}
                      ></textarea>
                      {abstractLimitError && (
                        <p className="text-red-500 text-xs italic">
                          Word limit exceeded (max 1000 words)
                        </p>
                      )}
                      {errors.abstract && !abstractLimitError && (
                        <p className="text-red-500 text-xs italic">
                          {errors.abstract}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 flex flex-col">
                      <label className="block text-gray-700">
                        PDF File only: <span className="text-red-500">*</span>
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
                          className={`form-input mt-1 block w-full ${
                            errors.pdfFile || pdfFileTypeError ? "border-red-500" : ""
                          }`}
                          onChange={handlePdfFileChange}
                          disabled={editPaper}
                        />
                        {pdfFile && !editPaper && (
                          <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleViewPDF}
                          >
                            View PDF
                          </button>
                        )}
                      </div>
                      {pdfFileTypeError && (
                        <p className="text-red-500 text-xs italic">
                          Please upload a PDF file only.
                        </p>
                      )}
                      {errors.pdfFile && !pdfFileTypeError && (
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
                              className="flex space-x-4 items-center"
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
                                disabled={editPaper}
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
                                disabled={editPaper}
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
                                disabled={editPaper}
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
                                disabled={editPaper}
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
                                disabled={editPaper}
                              />
                              <button
                                type="button"
                                className="border rounded border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                                onClick={() => handleDeleteCoAuthor(index)}
                                disabled={editPaper}
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
                                  disabled={editPaper}
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
                                  disabled={editPaper}
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
                                  disabled={editPaper}
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
                                  disabled={editPaper}
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
                                  disabled={editPaper}
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
                                    disabled={editPaper}
                                  />
                                  <span className="ml-1">Corresponding Author</span>
                                </label>
                                <button
                                  type="button"
                                  className="border rounded border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                                  onClick={() => handleDeleteCoAuthor(index)}
                                  disabled={editPaper}
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
                        disabled={editPaper}
                      >
                        Add Co-Author
                      </button>
                    </div>

                    <div className="flex justify-center md:space-x-6 md:gap-4">
                      <button
                        type="submit"
                        className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                      <button
                        type="button"
                        className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                        onClick={handleEditToggle}
                      >
                        {editPaper ? "Edit" : "Cancel Edit"}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorRegistration;

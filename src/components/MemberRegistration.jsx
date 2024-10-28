import React, { useState, useEffect } from "react";
import {
  getallcommittees,
  createCommitteeMembers,
  gellAllusersBeforDate,
  gellmembersbycom,
  editMembers
} from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function MemberRegistration() {
  const [oldmembers, setOldmembers] = useState([]);
  const [selectedOldMembers, setSelectedOldMembers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [place, setPlace] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [selectedCommittee, setSelectedCommittee] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [conference_name, setConference_name] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [existingmambers, setExistingmambers] = useState([]);
  const [data, SetData] = useState(true);
  const [memberDetails, setMemberDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedMember, setEditedMember] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      getallcommittees(conference_id)
        .then((res) => {
          setCommittees(res.data.committee);
          setConference_name(res.data.conferenceName);
          // console.log(res.data);
          SetData(false);
          setTemp(0);
        })
        .catch((err) => {});
    } else {
      setShowPopup(true);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedCommittee) {
      alert("select committee first");
      return;
    }
    const formData = {
      name,
      email,
      affiliation,
      country,
      mobile,
      role,
    };
    const isEmailExist = members.some(
      (member) => member.email === formData.email
    );

    if (isEmailExist) {
      alert("Email already exists! Please use a different email.");
      return; // Exit function if email already exists
    }
    setMembers([...members, formData]);
  };
  //console.log('Form Data:', formData);
  // You can add more code here to handle form submission, e.g., send the data to a server

  const deleteEach = (email) => {
    setMembers(members.filter((member) => member.email !== email));
    //console.log(email);
  };

  const allclose = () => {
    setMembers([]);
  };

  const finalsave = () => {
    if (!selectedCommittee) {
      alert("select committee first");
      return;
    }
    //console.log(members);
    const transformedData = {
      members: members.map((item) => ({
        name: item.name,
        country: item.country,
        mobile: item.mobile,
        role: item.role,
        email: item.email,
      })),
    };
    console.log(transformedData);
    console.log(selectedCommittee.id);
    
    createCommitteeMembers(transformedData, selectedCommittee.id)
      .then((Response) => {
        console.log(selectedCommittee);
        setName("");
        setEmail("");
        setAffiliation("");
        setCountry("");
        setMobile("");
        setRole("");
        setMembers([]);


        // Update existing reviewers with new data from the response
        if (Response.data && Response.data.members) {
          // Use functional state update to ensure the existing state is captured correctly
          setExistingmambers((prevMembers) => [
            ...prevMembers,
            ...Response.data.members,
          ]);
        }
        setMembers([]);
        handleSuccess();

        console.log("Members added successfully:", Response.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          alert(err.response.data.errors[0].error);
        }
      });
  };

  const finalEdit = () => {
    const formData = {
      id,
      name,
      email,
      affiliation,
      country,
      mobile,
      role,
    };
    console.log(formData);
    // console.log(members.id);
    setMembers(
      members.map((member) =>
        member.email === email ? { ...member, ...formData } : member
      )
    );
    setIsEditing(false); // Reset after editing
    
    editMembers(id, formData).then((res) => {
      console.log(res.data);
      setUpdateMessage('Member updated successfully!');
      setTimeout(() => {
        setUpdateMessage('');
      }, 2000); // hide the message after 2 seconds
    }).catch((err) => {
      console.log(err);
    });
  }

  const getoldmembers = () => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      gellAllusersBeforDate(conference_id)
        .then((res) => {
          setOldmembers(res.data);
          console.log(res.data);
          
        })
        .catch((err) => {});
    }
  };

  

  const handleOldMembers = () => {
    const selectedData = oldmembers.filter((member) =>
      selectedRows.includes(member._id)
    );
    console.log(selectedData); // Do something with the selected data
  };

  const handleAddClick = () => {
    if (!selectedCommittee) {
      alert("select committee first");
      return;
    }
    const selectedMembers = oldmembers.filter((member) =>
      selectedRows.includes(member._id)
    );

    const duplicateMembers = selectedMembers.filter((member) =>
      members.some((existingMember) => existingMember._id === member._id)
    );

    if (duplicateMembers.length > 0) {
      window.alert("Some of the selected members are already added.");
    } else {
      setMembers((prevMembers) => [...prevMembers, ...selectedMembers]);
      console.log(selectedMembers); // or process the selected members as needed
    }
    setSelectedRows([]);
  };

  const handleRedirect = () => {
    // history.push('/another-page'); // Change '/another-page' to the actual path you want to redirect to
    navigate("/select-conference");
  };

  const redirectToHome = () => {
    navigate("/select-conference"); //redirection by home icon
  };

  const handleSuccess = () => {
    setSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000); // 3000ms = 3 seconds
  };

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

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleMemberDetails = (member) => {
    setMemberDetails(member);
    setShowModal(true);
  };

  const handleRowClick = (member) => {
    setId(member._id);
    setName(member.name);
    setEmail(member.email);
    setAffiliation(member.affiliation || "");
    setCountry(member.country || "");
    setMobile(member.mobile || "");
    setRole(member.role || "");
    setIsEditing(true);
    // Log member details to console
    console.log("Member Details:", member);
  };

  const handleRowClick2 = (member) => {
    if (selectedRows.includes(member._id)) {
      setSelectedRows(selectedRows.filter((id) => id !== member._id));
    } else {
      setSelectedRows([...selectedRows, member._id]);
    }
  };

  // const handleEditClick = (member) => {
  //   setEditMode(true);
  //   setEditedMember(member);
  //   handleRowClick(member);
  // };
  // Function to handle edit click
  const handleEditClick = (member) => {
    setEditMode(true);
    setEditedMember(member);
    // Set form fields with the member details
    setName(member.name);
    setEmail(member.email);
    setAddress(member.address || ""); // Set default to empty string if undefined
    setAffiliation(member.affiliation || "");
    setPlace(member.place || "");
    setState(member.state || "");
    setCountry(member.country || "");
    setMobile(member.mobile || "");
    setRole(member.role || "");
  };

  const handleOldMemberSelect = (member) => {
    setSelectedOldMembers((prevSelected) => {
      // Toggle selection
      if (prevSelected.includes(member)) {
        return prevSelected.filter((m) => m !== member);
      } else {
        return [...prevSelected, member];
      }
    });
  };

  const handleAddOldMembersToCommittee = () => {
    // Filter out already existing members in the committee
    const newMembers = selectedOldMembers.filter(
      (oldMember) =>
        !existingmambers.some((member) => member.email === oldMember.email)
    );

    // Add new members to the selected committee
    setExistingmambers((prevMembers) => [...prevMembers, ...newMembers]);

    // Clear selected old members after adding
    setSelectedOldMembers([]);
  };

  const handleDeleteClick = (id) => {
    const updatedExistingMembers = existingmambers.filter(
      (member) => member._id !== id
    );
    setExistingmambers(updatedExistingMembers);
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
          <u>Include the Members</u>
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
      {data ? (
        <div>Loading..</div>
      ) : (
        <>
          <div className="md:flex justify-between">
            <div className="m-2 md:m-4">
              <h2 className="text-xl md:text-2xl text font-semibold text-black">
                Conference Name : {toSentenceCase(conference_name)}
              </h2>
            </div>
            <div>
              <label
                htmlFor="expectedSubmissions"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Select Committee
                </span>
                <select
                  id="expectedSubmissions"
                  name="expectedSubmissions"
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
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
          </div>
          <div>
            {/* row1 */}
            <form onSubmit={handleSubmit}>
              <div className="p-3 space-y-4 md:space-y-0 md:space-x-4 md:flex">
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Name<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Email<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
              </div>

              {/* row2 */}
              <div className="p-3 space-y-4 md:space-y-0 md:space-x-4 md:flex">
                {/* Affiliation Field */}
                <div className="flex-1">
                  <label
                    htmlFor="affiliation"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Affiliation<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="affiliation"
                      name="affiliation"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      // required
                    />
                  </label>
                </div>
                {/* <div className="flex-1">
                  <label
                    htmlFor="address"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Address<span style={{ color: 'red' }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={toSentenceCase(address)}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </label>
                </div> */}
                {/* Place Field */}
                {/* <div className="flex-1">
                  <label
                    htmlFor="place"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Place<span style={{ color: 'red' }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="place"
                      name="place"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={toSentenceCase(place )}
                      onChange={(e) => setPlace(e.target.value)}
                      required
                    />
                  </label>
                </div> */}
                {/* State Field */}
                {/* <div className="flex-1">
                  <label
                    htmlFor="state"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      State<span style={{ color: 'red' }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={toSentenceCase(state)}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </label>
                </div> */}
              </div>

              {/* row3 */}
              <div className="p-3 space-y-4 md:space-y-0 md:space-x-4 md:flex">
                {/* Country Field */}
                <div className="flex-1">
                  <label
                    htmlFor="country"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Country<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </label>
                </div>
                {/* Mobile Field */}
                <div className="flex-1">
                  <label
                    htmlFor="mobile"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Mobile
                    </span>
                    <input
                      type="number"
                      id="mobile"
                      name="mobile"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      // required
                    />
                  </label>
                </div>
                {/* Role Field */}
                <div className="flex-1">
                  <label
                    htmlFor="role"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Role<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </label>
                </div>
              </div>

              {/* for button */}
              <div className="flex items-center justify-center mt-3">
                {isEditing ? (
                  <button
                    className="inline-block rounded border border-indigo-600 bg-slate-300 px-7 py-2 text-sm font-medium text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="button"
                    onClick={finalEdit}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="submit"
                  >
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
          {/* ----------------- */}
          <div className="w-full h-auto md:flex">
            <div className="mt-4 w-full h-96 border border-3 shadow-sm">
              <div className="text-center text-xl font-semibold">
                <h2>Old Members</h2>
              </div>
              {/* for old members table */}
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {oldmembers.map((member) => (
                      <tr
                        key={member._id}
                        onClick={() => {
                          handleRowClick(member);
                          handleRowClick2(member);
                        }}
                        className={`cursor-pointer ${
                          selectedOldMembers.includes(member._id)
                            ? "bg-gray-200"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {toSentenceCase(member.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* for buttons */}
              <div className="flex justify-center gap-3">
                <div className="flex items-center justify-center mt-3">
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="button"
                    onClick={getoldmembers}
                  >
                    List of Old Members
                  </button>
                </div>
                <div className="flex items-center justify-center mt-3">
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="button"
                    onClick={handleAddClick}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 w-full h-96 border border-3 shadow-sm">
              <div className="text-center text-xl font-semibold">
                <h2>Members For {toSentenceCase(selectedCommittee.name)}</h2>
              </div>
              {success && (
                <div
                  className="flex items-center justify-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-4.293-3.707a1 1 0 00-1.414 0L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="font-medium">Success!</span> Members Added
                  successfully!
                </div>
              )}
              <div className="mt-2  w-full h-72 overflow-auto">
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
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {existingmambers.map((member) => (
                      <tr
                        key={member._id}
                        onClick={() => handleRowClick(member)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {toSentenceCase(member.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.email}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                          onClick={() => handleDeleteClick(member._id)}
                        >
                          ✖
                        </td>
                      </tr>
                    ))}
                    {/* ----------------- */}
                    {members.map((member) => (
                      <tr key={member.email}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {toSentenceCase(member.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            // onClick={() => removeCommittee(committee.id)}
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteEach(member.email)}
                          >
                            ✖
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center gap-3">
                <div className="flex items-center justify-center mt-3">
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="submit"
                    onClick={() => finalsave()}
                  >
                    Save
                  </button>
                </div>
                {/* <div className='flex items-center justify-center mt-3'>
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="submit"
                    onClick={() => allclose()}
                  >
                    Close
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Member Details</h2>
                <p>Name: {memberDetails.name}</p>
                <p>Email: {memberDetails.email}</p>
                <p>Address: {memberDetails.address}</p>
                <p>Affiliation: {memberDetails.affiliation}</p>
                <p>Place: {memberDetails.place}</p>
                <p>State: {memberDetails.state}</p>
                <p>Country: {memberDetails.country}</p>
                <p>Mobile: {memberDetails.mobile}</p>
                <p>Role: {memberDetails.role}</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MemberRegistration;

import React, { useState } from "react";

const ConferenceServices = {
  createConference: async (formData) => { // Removed :any
    // Simulate an API call with a delay.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Simulated API call with data:", formData);
    // In a real app, we'd return the response from the API.
    return { success: true, message: "Conference created successfully!" };
  },
};

function ConferenceCreation() {
  /* Define state variables for each field
     useState hook returns an array with 2 elements:
      - The current state variable's value
      - A function that allows you to update that state variable */
  const [conference_title, setConference_Title] = useState(""); // Holds conference title, initially 
  const [shortName, setShortName] = useState(""); // Holds short name, initially 
  const [website, setWebsite] = useState(""); // Holds website URL, initially 
  const [plagiarismWebsite, setPlagiarismWebsite] = useState("");
  const [copyrightWebsite, setCopyrightWebsite] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [from_date, setfrom_date] = useState("");
  const [to_date, setto_date] = useState("");
  const [date_of_call_for_paper, setdate_of_call_for_paper] = useState("");
  const [last_date_paper_sub, setlast_date_paper_sub] = useState("");
  const [number_of_papers, setnumber_of_papers] = useState("");
  const [loading, setLoading] = useState(false); // Holds loading state (for async ops), initially false | The loading state is a flag to help control the UI during asynchronous tasks.
  const [success, setSuccess] = useState(false); // Holds success state, initially false

  // Handle form submission
  // This function is called when the form is submitted
  const handleSubmit = async (e) => { // Removed : React.FormEvent
    setLoading(true); // Set loading to true, e.g., show a spinner
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Create an object containing all the form data from the state variables
    const formData = {
      conference_title,
      shortName,
      website,
      plagiarismWebsite,
      copyrightWebsite,
      venue,
      address,
      place,
      state,
      country,
      from_date,
      to_date,
      date_of_call_for_paper,
      last_date_paper_sub,
      number_of_papers,
    };
    console.log("Form Data:", formData);
    try {
      const response = await ConferenceServices.createConference(formData); // Await here
      setSuccess(true); // set success to true
      console.log(response);
      alert("Conference created successfully!"); // give user feedback
      clear_feilds();
    } catch (error) {
      console.error("Error creating conference:", error);
      alert("Failed to create conference. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const clear_feilds = () => {
    setConference_Title("");
    setShortName("");
    setWebsite("");
    setPlagiarismWebsite("");
    setCopyrightWebsite("");
    setVenue("");
    setAddress("");
    setPlace("");
    setState("");
    setCountry("");
    setfrom_date("");
    setto_date("");
    setdate_of_call_for_paper("");
    setlast_date_paper_sub("");
    setnumber_of_papers("");
  };

  return (
    <div className="w-full h-full border-3 shadow-sm p-3  mb-5 bg-body-tertiary rounded bg-slate-50 overflow-auto">
      <div className="flex items-center justify-center text-4xl m-5">
        <u>Create Conference</u>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-6 m-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="conference_title"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Conference Title<span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  id="conference_title"
                  name="conference_title"
                  value={conference_title}
                  onChange={(e) => setConference_Title(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="shortName"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Short Name
                </span>
                <input
                  type="text"
                  id="shortName"
                  name="shortName"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="website"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Website
                </span>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="venue"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Venue<span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Address<span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="place"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Place<span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  id="place"
                  name="place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="state"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  State<span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="country"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Country<span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="from_date"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  From Date<span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  id="from_date"
                  name="from_date"
                  value={from_date}
                  onChange={(e) => setfrom_date(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="to_date"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  To Date<span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  id="to_date"
                  name="to_date"
                  value={to_date}
                  onChange={(e) => setto_date(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="date_of_call_for_paper"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Date Of Call For Paper<span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  id="date_of_call_for_paper"
                  name="date_of_call_for_paper"
                  value={date_of_call_for_paper}
                  onChange={(e) => setdate_of_call_for_paper(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="last_date_paper_sub"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Last Date For Paper Submission
                  <span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  id="last_date_paper_sub"
                  name="last_date_paper_sub"
                  value={last_date_paper_sub}
                  onChange={(e) => setlast_date_paper_sub(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plagiarism Website */}
            <div>
              <label
                htmlFor="plagiarism_website"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Plagiarism Website
                </span>
                <input
                  type="url"
                  id="plagiarism_website"
                  name="plagiarism_website"
                  value={plagiarismWebsite}
                  onChange={(e) => setPlagiarismWebsite(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder=""
                />
              </label>
            </div>

            {/* Copyright Website */}
            <div>
              <label
                htmlFor="copyright_website"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Copyright Website
                </span>
                <input
                  type="url"
                  id="copyright_website"
                  name="copyright_website"
                  value={copyrightWebsite}
                  onChange={(e) => setCopyrightWebsite(e.target.value)}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder=""
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap justify-between">
            <label
              htmlFor="number_of_papers"
              className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span className="text-xs font-medium text-gray-700">
                How Many Submissions Do You Expect
                <span className="text-red-500">*</span>
              </span>
              <select
                id="number_of_papers"
                name="number_of_papers"
                value={number_of_papers}
                onChange={(e) => setnumber_of_papers(e.target.value)}
                className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                required
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="<100">&lt;100</option>
                <option value="<500">&lt;500</option>
                <option value="<1000">&lt;1000</option>
                <option value="<2000">&lt;2000</option>
                <option value="<5000">&lt;5000</option>
                <option value="<10000">&lt;10000</option>
                <option value="<20000">&lt;20000</option>
              </select>
            </label>
          </div>

          {loading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConferenceCreation;

/* Short name 
 <input
  type="text"
  id="shortName"
  name="shortName"
  value={shortName}
  onChange={(e) => setShortName(e.target.value)}
  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
  // REMOVED required attribute
/> */ 

/* Website
<input
  type="text"
  id="website"
  name="website"
  value={website}
  onChange={(e) => setWebsite(e.target.value)}
  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
  // REMOVED required attribute
/> */

/* Plagiarism 
 <input
  type="url"
  id="plagiarism_website"
  name="plagiarism_website"
  value={plagiarismWebsite}
  onChange={(e) => setPlagiarismWebsite(e.target.value)}
  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
  placeholder=""
  // REMOVED required attribute
/> */

/* Copyright website 
<input
  type="url"
  id="copyright_website"
  name="copyright_website"
  value={copyrightWebsite}
  onChange={(e) => setCopyrightWebsite(e.target.value)}
  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
  placeholder=""
  // REMOVED required attribute
/> */

//done
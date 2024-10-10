import React, { useState } from "react";
import { createConference } from "../services/ConferenceServices";

function ConferenceCreation() {
  // Define state variables for each field
  const [conference_title, setConference_Title] = useState("");
  const [shortName, setShortName] = useState("");
  const [website, setWebsite] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      conference_title,
      shortName,
      website,
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
    createConference(formData)
      .then((res) => {
        // setSuccess(true);
        // setLoading(false);
        console.log(res);
        alert("conference created");
        clear_feilds();
      })
      .then((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const clear_feilds = () => {
    setConference_Title("");
    setShortName("");
    setWebsite("");
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
                  required
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
                  required
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
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  required
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

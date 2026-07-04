import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  CreditCard,
} from "lucide-react";
import {
  serviceService,
  applicationService,
  lockerService,
} from "../services/dataService";
import toast from "react-hot-toast";

export default function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.pathname.includes("/scheme") ? "scheme" : "service";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    pincode: "",
    documents: null,
    lockerDocumentId: null,
  });
  const [lockerDocs, setLockerDocs] = useState([]);
  const [showLocker, setShowLocker] = useState(false);

  useEffect(() => {
    // Fetch service/scheme details to show summary
    if (type === "service") {
      serviceService
        .getById(id)
        .then((res) => setData(res.data.data.service))
        .catch((err) => console.log(err));
    } else {
      setData({
        name: "Welfare Scheme Application",
        department: "Social Welfare",
        fees: 0,
      });
    }

    // Fetch locker documents
    lockerService
      .getAll()
      .then((res) => setLockerDocs(res.data.data))
      .catch(() => {});
  }, [id, type]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        serviceId: type === "service" ? id : null,
        schemeId: type === "scheme" ? id : null,
        submittedData: formData,
        priority: "medium",
      };
      const res = await applicationService.submit(payload);
      toast.success("Application Draft Created!");

      const appId = res.data.data.application.id;
      const fees = data?.fees || 0;

      if (fees > 0) {
        navigate(`/payment/${appId}`);
      } else {
        toast.success("Application Submitted Successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gov-navy mb-2">
            {data ? data.name : "Loading..."}
          </h1>
          <p className="text-muted">
            Fill out the multi-step application form below.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
            <div
              className="absolute left-0 top-1/2 h-1 bg-gov-blue -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors ${step >= 1 ? "bg-gov-blue text-white" : "bg-gray-200 text-gray-500"}`}
            >
              1
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors ${step >= 2 ? "bg-gov-blue text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors ${step >= 3 ? "bg-gov-blue text-white" : "bg-gray-200 text-gray-500"}`}
            >
              3
            </div>
          </div>
          <div className="flex justify-between text-xs font-semibold text-gray-500 mt-2 px-1">
            <span>Basic Info</span>
            <span>Documents</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-card bg-white p-8 rounded-2xl shadow-sm border border-border-color">
          <form
            onSubmit={
              step === 3
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    handleNext();
                  }
            }
          >
            <AnimatePresence mode="wait">
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-xl font-bold mb-6 text-gov-navy border-b pb-2">
                    1. Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Full Name (As per Aadhaar)
                      </label>
                      <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="premium-input w-full bg-white border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Date of Birth
                      </label>
                      <input
                        required
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="premium-input w-full bg-white border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Gender
                      </label>
                      <select
                        required
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="premium-input w-full bg-white border border-gray-300"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Pincode
                      </label>
                      <input
                        required
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="premium-input w-full bg-white border border-gray-300"
                        maxLength="6"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">
                        Permanent Address
                      </label>
                      <textarea
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="premium-input w-full bg-white border border-gray-300 rounded-lg p-3"
                      ></textarea>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Documents */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-xl font-bold mb-6 text-gov-navy border-b pb-2">
                    2. Upload Documents
                  </h3>
                  <p className="text-sm text-muted mb-6">
                    Please upload clear, legible copies of the requested
                    documents or fetch from your Digital Locker.
                  </p>

                  {!showLocker ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 mb-6 hover:bg-gray-100 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: e.target.files[0],
                            lockerDocumentId: null,
                          })
                        }
                      />
                      <Upload
                        className="mx-auto text-gov-blue mb-4"
                        size={32}
                      />
                      <h4 className="font-bold text-gray-700">
                        Click or drag files here to upload
                      </h4>
                      <p className="text-xs text-gray-500 mt-2">
                        Aadhaar Card, Passport Photo, Address Proof
                      </p>
                      {formData.documents && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} /> {formData.documents.name}{" "}
                          selected
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
                      <h4 className="font-bold text-gov-blue mb-3">
                        Select from Digital Locker
                      </h4>
                      {lockerDocs.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No documents found in locker.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {lockerDocs.map((doc) => (
                            <div
                              key={doc.id}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  documents: {
                                    name: doc.name,
                                    fromLocker: true,
                                  },
                                  lockerDocumentId: doc.id,
                                });
                                setShowLocker(false);
                              }}
                              className="p-3 border rounded-lg bg-white cursor-pointer hover:border-gov-blue flex items-center gap-3"
                            >
                              <FileText className="text-gov-blue" size={20} />
                              <div>
                                <p className="font-bold text-sm">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {doc.category}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowLocker(!showLocker)}
                      className="text-sm font-bold text-gov-blue hover:underline flex items-center gap-1"
                    >
                      {showLocker
                        ? "Upload manually instead"
                        : "Import from Digital Locker"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review & Submit */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-xl font-bold mb-6 text-gov-navy border-b pb-2">
                    3. Review Application
                  </h3>

                  <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <FileText size={18} /> Application Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div className="text-gray-500">Applicant Name:</div>
                      <div className="font-bold text-gray-900">
                        {formData.fullName}
                      </div>

                      <div className="text-gray-500">Date of Birth:</div>
                      <div className="font-bold text-gray-900">
                        {formData.dob}
                      </div>

                      <div className="text-gray-500">Service Fee:</div>
                      <div className="font-bold text-green-700">
                        {data?.fees > 0 ? `₹${data.fees}` : "Free"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
                    <input
                      type="checkbox"
                      required
                      className="mt-1"
                      id="declaration"
                    />
                    <label
                      htmlFor="declaration"
                      className="text-xs text-gray-600"
                    >
                      I hereby declare that all the information provided by me
                      in this application is true, complete and correct to the
                      best of my knowledge and belief.
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-gov-outline flex items-center gap-2 py-2 px-6"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gov-primary flex items-center gap-2 py-2 px-8"
              >
                {loading ? (
                  <div
                    className="spinner"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderWidth: "2px",
                    }}
                  ></div>
                ) : step === 3 ? (
                  data?.fees > 0 ? (
                    "Proceed to Pay"
                  ) : (
                    "Submit Application"
                  )
                ) : (
                  "Next Step"
                )}
                {!loading && step < 3 && <ChevronRight size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

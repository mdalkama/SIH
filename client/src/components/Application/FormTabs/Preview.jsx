import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Edit, X, CreditCard } from "lucide-react";

const APPLICATION_API_URL = 'https://sih-4ptm.onrender.com/api/v1/application';

const Preview = ({
  formData = {},
  uploadedFiles = {},
  isSubmitting = false,
  setActiveTab,
  onPaymentComplete,
  isFormDisabled = false
}) => {
  // State management
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'info' });

  // Application fees calculation
  const applicationFees = useMemo(() => 100, []);

  // Final Data Log - Only after complete form submission
  useEffect(() => {
    if (paymentCompleted) {
      setTimeout(() => {
        console.log('\n=== 🎆 FORM COMPLETELY SUBMITTED - FINAL DATA ===');
        console.log('\n📝 COMPLETE FORM DATA:');
        console.log(formData);
        console.log('\n📁 UPLOADED FILES:');
        console.log(uploadedFiles);
        console.log('\n💳 PAYMENT INFORMATION:');
        console.log({
          paymentStatus: 'SUCCESS',
          applicationFees: applicationFees,
          paymentDate: new Date().toLocaleString('en-IN'),
          submissionTime: new Date().toISOString()
        });
        console.log('\n🎯 FINAL APPLICATION SUMMARY:');
        console.log({
          applicantName: formData.applicantName || 'Not Provided',
          fatherName: formData.fatherName || 'Not Provided',
          email: formData.email || 'Not Provided',
          mobile: formData.mobile || 'Not Provided',
          dateOfBirth: formData.dateOfBirth || 'Not Provided',
          totalUploadedFiles: Object.keys(uploadedFiles || {}).length,
          applicationStatus: 'COMPLETED_AND_SUBMITTED',
          finalStatus: 'SUCCESS'
        });
        console.log('=== ✅ APPLICATION PROCESSING COMPLETE ===\n');
      }, 1000);
    }
  }, [paymentCompleted, formData, uploadedFiles, applicationFees]);

  // Custom Alert Function 
  const showAlert = useCallback((title, message, type = 'info') => {
    setAlertMessage({ title, message, type });
    setShowCustomAlert(true);
    setTimeout(() => setShowCustomAlert(false), 4000);
  }, []);

  // Form validation
  const validateAllFields = useMemo(() => {
    const missingFields = [];
    const requiredPersonalFields = ['applicantName', 'fatherName', 'motherName', 'gender', 'dateOfBirth', 'email', 'mobile'];
    requiredPersonalFields.forEach(field => {
      if (!formData[field]) missingFields.push(field);
    });
    const requiredDocs = ['studentPhoto', 'studentSign', 'aadharCard', 'tenthMarksheet'];
    const missingDocs = requiredDocs.filter(doc => !uploadedFiles[doc]);
    missingFields.push(...missingDocs);
    return missingFields;
  }, [formData, uploadedFiles]);

  // Edit handler
  const handleEdit = useCallback((tabIndex) => {
    setActiveTab(tabIndex);
  }, [setActiveTab]);

  // Final submit handler
  const handleFinalSubmit = useCallback(() => {
    if (!declarationChecked) {
      showAlert(
        'घोषणा आवश्यक / Declaration Required',
        'कृपया घोषणा चेकबॉक्स पर टिक करें। / Please check the declaration checkbox.',
        'warning'
      );
      return;
    }

    if (validateAllFields.length > 0) {
      showAlert(
        'अधूरी जानकारी / Incomplete Information',
        `कृपया निम्नलिखित फ़ील्ड भरें: ${validateAllFields.slice(0, 3).join(', ')}${validateAllFields.length > 3 ? ` और ${validateAllFields.length - 3} अन्य` : ''}`,
        'warning'
      );
      return;
    }

    setShowPaymentPopup(true);
  }, [declarationChecked, validateAllFields, showAlert]);

  const handlePayment = useCallback(async () => {
    console.log("1. Starting payment process...");
    setPaymentProcessing(true);

    try {
      // 1. Create a FormData object
      const formDataToSend = new FormData();

      // 2. Append all text fields from formData
      for (const key in formData) {
        // Handle arrays (like optionChoices) properly
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      // 3. Append all files from uploadedFiles
      for (const key in uploadedFiles) {
        formDataToSend.append(key, uploadedFiles[key]);
      }

      console.log("2. Sending application data (as FormData) to backend...");

      // 4. Send the request using FormData
      const submitResponse = await fetch(`${APPLICATION_API_URL}/submit`, {
        method: 'POST',
        // DO NOT set the 'Content-Type' header. 
        // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
        body: formDataToSend,
      });

      console.log("3. Received response from /submit endpoint. Status:", submitResponse.status);

      const submitData = await submitResponse.json();
      console.log("4. Parsed JSON response from /submit:", submitData);

      if (!submitResponse.ok) {
        throw new Error(submitData.message || "Failed to create payment order from server.");
      }

      const { order, key_id } = submitData;
      console.log(order, key_id);

      if (!order || !key_id) {
        throw new Error("Server response is missing 'order' or 'key_id'. Cannot proceed with payment.");
      }

      console.log("5. Order created successfully. Razorpay Order ID:", order.id);

      const options = {
        key: key_id,
        amount: order.amount,
        currency: "INR",
        name: "DTE Rajasthan",
        description: "Application Form Fee",
        image: "https://svumshow.com/assets/images/department-logo/pngwing.png",
        order_id: order.id,
        handler: async function (response) {
          console.log("7. Payment successful on Razorpay. Verifying on backend...");

          const verifyResponse = await fetch(`${APPLICATION_API_URL}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.success) {
            throw new Error(verifyData.message || "Payment verification failed on server.");
          }

          console.log("8. Verification successful!");
          setPaymentCompleted(true);
          setShowPaymentPopup(false);
          if (onPaymentComplete) onPaymentComplete();
          showAlert('Payment Successful', 'Your application has been submitted successfully!', 'success');
        },
        prefill: {
          name: formData.applicantName,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#1e40af",
        },
      };

      console.log("6. Opening Razorpay popup with options...");

      if (!window.Razorpay) {
        throw new Error("Razorpay script has not loaded. Please check your internet connection and refresh the page.");
      }

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error("Razorpay payment.failed event:", response.error);
        showAlert('Payment Failed', `Reason: ${response.error.description}. Please try again.`, 'error');
        setPaymentProcessing(false);
      });

      rzp.open();

    } catch (err) {
      console.error("!!! ERROR during payment process:", err);
      showAlert('An Error Occurred', err.message, 'error');
      setPaymentProcessing(false);
    }
  }, [formData, uploadedFiles, onPaymentComplete, showAlert]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-[#1e40af] mb-2">
            आवेदन पूर्वावलोकन (Application Preview)
          </h3>
          <p className="text-xs sm:text-sm text-[#64748b]">
            कृपया सभी जानकारी की जांच करें। संपादन के लिए संबंधित टैब पर जाएं।
          </p>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Personal Details Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1e40af] text-white px-3 py-2 sm:px-4 sm:py-3 flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <h4 className="font-semibold text-sm sm:text-base">आवेदक विवरण</h4>
            <button
              onClick={() => handleEdit(0)}
              disabled={isFormDisabled}
              className={`flex items-center justify-center space-x-1 text-xs px-2 py-1 rounded transition-colors self-start sm:self-auto ${isFormDisabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              <Edit size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <tbody className="text-xs sm:text-sm">
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50 w-1/4">आवेदक का नाम</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 w-1/4">{formData.applicantName || 'Not Filled'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50 w-1/4">हिंदी में नाम</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 w-1/4">{formData.applicantNameHindi || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">पिता का नाम</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.fatherName || 'Not Filled'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">पिता का नाम हिंदी</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.fatherNameHindi || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">माता का नाम</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.motherName || 'Not Filled'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">माता का नाम हिंदी</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.motherNameHindi || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">लिंग (Gender)</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.gender || 'Not Filled'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">जन्म तिथि</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.dateOfBirth || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">ईमेल (Email)</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 break-all">{formData.email || 'Not Filled'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">मोबाइल</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.mobile || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">वैवाहिक स्थिति</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.maritalStatus || 'Not Filled'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">धर्म (Religion)</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.religion || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">राष्ट्रीयता</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.nationality || 'Not Filled'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">आरक्षण श्रेणी</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.reservationCategory || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">पहचान पत्र</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.identityProof || 'Not Filled'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">पहचान पत्र नंबर</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.identityNumber || 'Not Filled'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Educational Qualification Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 sm:px-4 sm:py-3">
            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">शैक्षणिक योग्यता</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">कक्षा</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">बोर्ड</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">वर्ष</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">रोल नंबर</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">अंक प्रकार</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">अधिकतम</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">प्राप्त</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-2 py-2 sm:px-4 sm:py-3">10</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.tenthBoard || 'CBSE'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.tenthYear || '2020'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.tenthRollNo || '15124202'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.tenthMarksType || 'CGPA/GPA'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.tenthMaxMarks || '10.0'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.tenthObtainedMarks || '9.0'}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.tenthPercentage || '85.5'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Details Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 sm:px-4 sm:py-3 flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">अन्य विवरण</h4>
            <button
              onClick={() => handleEdit(2)}
              disabled={isFormDisabled}
              className={`flex items-center justify-center space-x-1 text-xs px-2 py-1 rounded transition-colors self-start sm:self-auto ${isFormDisabled
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
            >
              <Edit size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <tbody className="text-xs sm:text-sm">
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50 w-1/2">माता-पिता की आय</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 w-1/2">{formData.parentIncome || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">आय राशि</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">₹{formData.parentIncomeAmount || 'Not Filled'}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-700 bg-gray-50">TFWS आवेदन</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{formData.tfwsApplication || 'Not Filled'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Option Form Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 sm:px-4 sm:py-3">
            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">विकल्प फॉर्म</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left border">Priority</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left border">College Name</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left border">Branch Name</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left border">Type</th>
                </tr>
              </thead>
              <tbody>
                {formData.optionChoices && formData.optionChoices.length > 0 ? (
                  formData.optionChoices.map((choice, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">{index + 1}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">{choice.collegeName || `(${choice.collegeId || 'N/A'}) ${choice.collegeName || 'Not Selected'}`}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">{choice.branchName || '(CE) Civil(GAS)'}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">{choice.collegeType || 'Govt.'}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="border-t">
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">1</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">(001) Govt. Polytechnic College, Ajmer</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">(CE) Civil(GAS)</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">Govt.</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">2</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">(003) Govt. Polytechnic College, Banswara</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">(CE) Civil(GAS)</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">Govt.</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">3</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">(181) Govt. Polytechnic College, Bundi</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">(CE) Civil(GAS)</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 border">Govt.</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3">
            <h4 className="font-semibold text-gray-700">अपलोड दस्तावेज़</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border">Sr. No.</th>
                  <th className="px-4 py-2 text-left border">Document Name</th>
                  <th className="px-4 py-2 text-left border">File Name</th>
                  <th className="px-4 py-2 text-left border">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(uploadedFiles).length > 0 ? (
                  Object.entries(uploadedFiles).map(([key, file], index) => {
                    const documentNames = {
                      studentPhoto: 'Student Photo',
                      studentSign: 'Student Signature',
                      aadharCard: 'Aadhar Card',
                      tenthMarksheet: 'Marksheet of 10th class',
                      preferentialCertificate: 'Preferential Category Certificate',
                      affidavitCertificate: 'Affidavit Certificate',
                      tfwsCertificate: 'TFWS Certificate',
                      twelfthMarksheet: '12th Marksheet',
                      graduationMarksheet: 'Graduation Marksheet',
                      mastersMarksheet: 'Masters Marksheet'
                    };
                    return (
                      <tr key={key} className="border-t">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border text-teal-600">
                          {documentNames[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </td>
                        <td className="px-4 py-2 border text-gray-600">{file.name}</td>
                        <td className="px-4 py-2 border">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            ✓ Uploaded
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr className="border-t">
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                      कोई दस्तावेज़ अपलोड नहीं किया गया / No documents uploaded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Declaration Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
          <div className="bg-gray-100 px-3 py-2 sm:px-4 sm:py-3 -mx-3 sm:-mx-6 -mt-3 sm:-mt-6 mb-3 sm:mb-4">
            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">घोषणा</h4>
          </div>
          <div className="flex items-start space-x-2 sm:space-x-3">
            <input
              type="checkbox"
              id="declaration"
              checked={declarationChecked}
              onChange={(e) => setDeclarationChecked(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
              required
            />
            <label htmlFor="declaration" className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              मेरे द्वारा यह प्रमाणित किया जाता है कि मैंने आवेदन पत्र भरने से पूर्व प्रशेक के सम्मुख में सभी दिशा निर्देश तथा नियम भरी नहीं सभी सूचनाओं सत्य एवं सही हैं। अंतिम आवेदन पत्र भरने से पूर्व मैंने सभी दिशा निर्देश और इन कोई झूठी या गलत जानकारी भरी गई है तो भविष्य में मेरे द्वारा सी विश्वविद्यालय एवं अनुदान का पात्र नहीं रहूंगा । मेरे द्वारा यह भी प्रमाणित किया जाता है कि मुझे किसी भी संस्थान द्वारा पूर्व में कभी भी निष्कासित नहीं किया गया है । अवितीय मेरे द्वारा सी कोई गलत जानकारी दी गई है तो नियम द्वारा सी कॉई चूका गलत पाई जाती है तो विभाग द्वारा सी लिया गया निर्णय उचित होगा । मेरे द्वारा दी गई जानकारी का लिखित रूप में प्रमाण पत्र उपलब्ध कराने के लिए मैं पूर्ण रूप से उत्तरदायी हूँ ।
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {!paymentCompleted && !isFormDisabled && (
        <div className="mt-8 text-center">
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#1e40af] text-white font-bold rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'सबमिट हो रहा है...' : 'फाइनल सबमिट करें / Final Submit'}
          </button>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  <CreditCard className="mr-2" size={18} />
                  Payment Gateway
                </h3>
                <button
                  onClick={() => setShowPaymentPopup(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-blue-100 mt-1">Please pay the application form fee for proceeding in the application status</p>
            </div>

            <div className="p-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="bg-gray-100 px-4 py-2">
                  <h4 className="font-semibold text-gray-700">Application Summary</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">आवेदक का नाम (Applicant's Name)</td>
                        <td className="px-4 py-2">{formData.applicantName || 'APPLICANT 92'}</td>
                        <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">पिता का नाम (Father's Name)</td>
                        <td className="px-4 py-2">{formData.fatherName || 'SWDASDAS'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">माता का नाम (Mother's Name)</td>
                        <td className="px-4 py-2">{formData.motherName || 'SHYAMA BAI'}</td>
                        <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">लिंग (Gender)</td>
                        <td className="px-4 py-2">{formData.gender || 'Male'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">जन्म तिथि (Date of Birth)</td>
                        <td className="px-4 py-2">{formData.dateOfBirth || '01/01/2006'}</td>
                        <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">श्रेणी (Category)</td>
                        <td className="px-4 py-2">{formData.reservationCategory || 'EWS'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">मोबाइल नंबर (Mobile Number)</td>
                        <td className="px-4 py-2">{formData.mobile || '9874562211'}</td>
                        <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">आवेदन शुल्क (Application Fees)</td>
                        <td className="px-4 py-2 font-bold text-[#1e40af]">₹{applicationFees}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handlePayment} /* This now calls the real payment logic */
                  disabled={paymentProcessing}
                  className="px-4 py-2 bg-[#10b981] text-white text-sm font-medium rounded-lg hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>💳 Pay Now</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      {showCustomAlert && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in duration-300">
            <div className={`p-4 text-white ${alertMessage.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
              alertMessage.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                alertMessage.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                  'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{alertMessage.title}</h3>
                <button
                  onClick={() => setShowCustomAlert(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 text-sm leading-relaxed">{alertMessage.message}</p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowCustomAlert(false)}
                  className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 ${alertMessage.type === 'success' ? 'bg-green-500 hover:bg-green-600' :
                    alertMessage.type === 'error' ? 'bg-red-500 hover:bg-red-600' :
                      alertMessage.type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                  ठीक / OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Popup */}
      {paymentCompleted && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-green-100">Your application has been submitted successfully.</p>
            </div>

            <div className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-800">Transaction Details</h4>
                    <p className="text-sm text-green-700 mt-1">Amount: ₹{applicationFees}</p>
                    <p className="text-xs text-green-600 mt-1">Transaction ID: TXN{Date.now()}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-6">Thank you for submitting your application. You will receive a confirmation email shortly.</p>
                <button
                  onClick={() => {
                    setPaymentCompleted(false);
                    // Reset form or redirect as needed
                  }}
                  className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Preview;
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  TrendingUp, 
  XCircle, 
  Download, 
  FileText, 
  Clock, 
  AlertTriangle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  Info
} from 'lucide-react';
import AcceptDecision from './accept';
import FloatDecision from './float';
import RejectDecision from './reject';

const ConfirmDecision = ({ decision = 'freeze', onGoBack }) => {
  const [agreeToDeclaration, setAgreeToDeclaration] = useState(false);
  const [showAcceptPage, setShowAcceptPage] = useState(false);
  const [showFloatPage, setShowFloatPage] = useState(false);
  const [showRejectPage, setShowRejectPage] = useState(false);

  // Dynamic content based on decision type
  const getDecisionConfig = () => {
    switch (decision) {
      case 'freeze':
        return {
          title: 'Accept & Freeze',
          subtitle: 'Confirm your seat allocation',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          badgeColor: 'bg-green-100 text-green-800',
          description: 'You are confirming your seat at National Tech University. This decision is final and you will exit the counselling process.',
          consequences: [
            'Your seat is confirmed and secured',
            'You must report physically to the institute',
            'You will exit the counselling process',
            'No further rounds will be available to you',
            'Seat acceptance fee must be paid'
          ],
          nextSteps: [
            'Download your allotment letter',
            'Pay the seat acceptance fee',
            'Report to the institute by the deadline',
            'Complete document verification',
            'Begin your academic journey'
          ]
        };
      case 'float':
        return {
          title: 'Accept & Float',
          subtitle: 'Keep seat while trying for upgrades',
          icon: TrendingUp,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          badgeColor: 'bg-yellow-100 text-yellow-800',
          description: 'You are accepting the current seat while remaining eligible for upgrades in subsequent rounds.',
          consequences: [
            'Current seat is temporarily secured',
            'Eligible for upward movement in next rounds',
            'Must participate in subsequent counselling',
            'Seat may change if you get a better option',
            'Conditional seat acceptance fee required'
          ],
          nextSteps: [
            'Download your provisional allotment letter',
            'Pay the floating fee (refundable)',
            'Wait for next round results',
            'Be ready for potential upgrades',
            'Monitor counselling schedule'
          ]
        };
      case 'reject':
        return {
          title: 'Reject & Exit',
          subtitle: 'Give up current seat allocation',
          icon: XCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          badgeColor: 'bg-red-100 text-red-800',
          description: 'You are rejecting the current seat allocation and exiting the counselling process entirely.',
          consequences: [
            'Current seat will be forfeited',
            'You will exit the counselling process',
            'No further participation allowed',
            'Cannot reclaim this seat later',
            'All fees will be forfeited'
          ],
          nextSteps: [
            'Download rejection confirmation',
            'Forfeit all paid fees',
            'Exit counselling system',
            'Consider other admission options',
            'Plan alternative academic path'
          ]
        };
      default:
        return getDecisionConfig('freeze');
    }
  };

  const config = getDecisionConfig();
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (agreeToDeclaration) {
      // Here you would typically make an API call to submit the decision
      console.log('Decision submitted:', decision);
      
      // Navigate based on decision type
      if (decision === 'freeze') {
        setShowAcceptPage(true);
      } else if (decision === 'float') {
        setShowFloatPage(true);
      } else if (decision === 'reject') {
        setShowRejectPage(true);
      }
    }
  };

  // If showing accept page, render AcceptDecision component
  if (showAcceptPage) {
    return <AcceptDecision />;
  }

  // If showing float page, render FloatDecision component
  if (showFloatPage) {
    return <FloatDecision />;
  }

  // If showing reject page, render RejectDecision component
  if (showRejectPage) {
    return <RejectDecision />;
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-1 px-1 sm:px-2">
      {/* Header */}
      <div className="mb-4">
        <button 
          onClick={onGoBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Go Back</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Confirm Decision</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Review and submit your final decision for Round 1</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Confirmation Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Decision Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
                <p className="text-sm text-gray-600">{config.subtitle}</p>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
                Round 1
              </span>
            </div>

            {/* Institute Details */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Candidate</p>
                  <p className="font-semibold text-gray-900">Aarav Sharma • App ID: 23C-1145</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Allotted Institute</p>
                  <p className="font-semibold text-gray-900">National Tech University</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Program</p>
                  <p className="font-medium text-gray-900">B.Tech Computer Science</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-600">Reporting Centre</p>
                  <p className="font-medium text-gray-900">NTU Main Campus, Block A</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Reporting By</p>
                  <p className="font-semibold text-red-600">12 Aug, 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Decision Description */}
            <div className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border mb-6`}>
              <h3 className="font-semibold text-gray-900 mb-2">What this means:</h3>
              <p className="text-sm text-gray-700 mb-4">{config.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Consequences:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {config.consequences.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Next Steps:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {config.nextSteps.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={agreeToDeclaration}
                  onChange={(e) => setAgreeToDeclaration(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="declaration" className="text-sm text-gray-700 cursor-pointer">
                  <strong>Declaration:</strong> I confirm that the information provided is correct. If I choose Freeze, I 
                  agree to report to the allotted institute and exit further counselling rounds. If Float, I understand 
                  the implications of my decision and agree to participate in subsequent rounds.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button 
                onClick={onGoBack}
                className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
              <button 
                onClick={handleConfirm}
                disabled={!agreeToDeclaration}
                className={`flex-1 px-6 py-2 text-white rounded-lg font-medium transition-colors ${
                  agreeToDeclaration 
                    ? config.buttonColor 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Shield className="h-4 w-4 inline mr-2" />
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Important Info */}
        <div className="space-y-3 sm:space-y-4">
          {/* Deadline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-600" />
              Deadline
            </h3>
            <div className="text-center mb-4">
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="text-lg font-bold text-red-600 mb-1">02d : 11h : 20m</p>
                <p className="text-xs text-gray-600">Decision window closes</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              You can change your decision until the window closes.
            </p>
          </div>

          {/* What happens after submit */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">What happens after submit?</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">You will receive a receipt and an email confirmation.</p>
                  <p className="text-gray-600 text-xs mt-1">
                    If you selected Freeze, your candidature exits further rounds. If Float, you remain eligible for upward movement while retaining the current seat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Need Help?</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-3 w-3 text-blue-600" />
                  <p className="text-xs font-medium text-gray-600">Email Support</p>
                </div>
                <p className="text-sm text-blue-700 font-medium">support@counselling.gov</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-3 w-3 text-green-600" />
                  <p className="text-xs font-medium text-gray-600">Phone Support</p>
                </div>
                <p className="text-sm text-green-700 font-medium">1800-000-123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDecision;
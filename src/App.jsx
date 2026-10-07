import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateUILPDF = async (studentName, studentId, companyName) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.text("ADDIS ABABA UNIVERSITY", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text("University-Industry Linkage (UIL) Office", 105, 28, { align: "center" });
  doc.text("Official Internship Support Letter", 105, 34, { align: "center" });
  doc.line(20, 38, 190, 38);
  
  // Body
  doc.setFontSize(11);
  doc.text(`To: ${companyName}`, 20, 50);
  doc.text(`Subject: Request for Industrial Internship Placement`, 20, 60);
  doc.text(
    `This is to certify that student ${studentName} (ID: ${studentId}) is currently enrolled in our university. We kindly request your institution to provide a practical internship placement.`,
    20, 75, { maxWidth: 170 }
  );
  
  // QR Code Verification
  const qrDataUrl = await QRCode.toDataURL(`https://your-domain.com/verify/${studentId}`);
  doc.addImage(qrDataUrl, 'PNG', 150, 110, 35, 35);
  doc.text("Scan to verify authenticity", 140, 150);
  
  // Save File
  doc.save(`UIL_Support_Letter_${studentId}.pdf`);
};
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Send, 
  UserCheck, 
  Search, 
  Plus, 
  Download, 
  QrCode, 
  Smartphone, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  Bell, 
  Wifi, 
  WifiOff, 
  Filter,
  Check,
  Eye,
  Briefcase,
  Layers,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

const initialApplications = [
  {
    id: 'APP-2026-001',
    company: 'Ethio Telecom',
    position: 'Network & System Intern',
    location: 'Addis Ababa (Head Office)',
    period: 'July 2026 - Sept 2026',
    appliedDate: '2026-03-10',
    uilStatus: 'Approved', // Pending, Approved, Rejected
    qrCodeValid: true,
    stage: 'Interview Scheduled', // Draft, UIL Pending, Letter Issued, Submitted, Interview Scheduled, Accepted, Rejected
    formatUsed: 'Standard Engineering Bio-Data',
    mentorAssigned: 'Dr. Kassahun Bekele',
    studentId: 'ETS1042/14',
    studentName: 'Abebe Tadesse',
    department: 'Software Engineering',
    gpa: '3.78'
  },
  {
    id: 'APP-2026-002',
    company: 'Commercial Bank of Ethiopia (CBE)',
    position: 'IT Infrastructure Trainee',
    location: 'Dire Dawa Branch',
    period: 'July 2026 - Sept 2026',
    appliedDate: '2026-03-14',
    uilStatus: 'Approved',
    qrCodeValid: true,
    stage: 'Submitted',
    formatUsed: 'FinTech Standard Format',
    mentorAssigned: 'Unassigned',
    studentId: 'ETS1042/14',
    studentName: 'Abebe Tadesse',
    department: 'Software Engineering',
    gpa: '3.78'
  },
  {
    id: 'APP-2026-003',
    company: 'Safaricom Ethiopia',
    position: 'Junior Software Engineer Intern',
    location: 'Addis Ababa (HQ)',
    period: 'July 2026 - Sept 2026',
    appliedDate: '2026-03-18',
    uilStatus: 'Approved',
    qrCodeValid: true,
    stage: 'Accepted',
    formatUsed: 'Standard Engineering Bio-Data',
    mentorAssigned: 'Dr. Kassahun Bekele',
    studentId: 'ETS1042/14',
    studentName: 'Abebe Tadesse',
    department: 'Software Engineering',
    gpa: '3.78'
  },
  {
    id: 'APP-2026-004',
    company: 'Information Network Security Administration (INSA)',
    position: 'Cybersecurity Analyst Intern',
    location: 'Addis Ababa',
    period: 'July 2026 - Sept 2026',
    appliedDate: '2026-03-25',
    uilStatus: 'Pending',
    qrCodeValid: false,
    stage: 'UIL Pending',
    formatUsed: 'Security Clearance Standard',
    mentorAssigned: 'Unassigned',
    studentId: 'ETS1042/14',
    studentName: 'Abebe Tadesse',
    department: 'Software Engineering',
    gpa: '3.78'
  }
];

const initialLogbooks = [
  {
    week: 1,
    dateRange: 'July 01 - July 05, 2026',
    summary: 'Orientation with Ethio Telecom IT team, network architecture overview, and dev environment configuration.',
    hoursLogged: 40,
    status: 'Approved',
    mentorFeedback: 'Great start Abebe. Keep documenting network diagrams.',
    rating: 5
  },
  {
    week: 2,
    dateRange: 'July 08 - July 12, 2026',
    summary: 'Configured router switches, assisted senior engineers with VLAN segmentation and subnet monitoring.',
    hoursLogged: 38,
    status: 'Approved',
    mentorFeedback: 'Detailed logs. Ensure safety compliance during hardware maintenance.',
    rating: 4.5
  },
  {
    week: 3,
    dateRange: 'July 15 - July 19, 2026',
    summary: 'Participated in backend system troubleshooting and monitored server load during peak hours.',
    hoursLogged: 42,
    status: 'Pending Review',
    mentorFeedback: '',
    rating: 0
  }
];

export default function App() {
  const [currentRole, setCurrentRole] = useState('student'); // 'student', 'uil_admin', 'company'
  const [lowDataMode, setLowDataMode] = useState(false);
  const [applications, setApplications] = useState(initialApplications);
  const [logbooks, setLogbooks] = useState(initialLogbooks);
  
  // UI Modals & Selections
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [selectedAppTimeline, setSelectedAppTimeline] = useState(initialApplications[0]);
  const [telegramAlerts, setTelegramAlerts] = useState([
    { id: 1, time: '10 mins ago', message: '📄 UIL Letter Approved for Safaricom Ethiopia! Stamped PDF ready for download.', type: 'success' },
    { id: 2, time: '2 hours ago', message: '🔔 Ethio Telecom updated your status to: Interview Scheduled.', type: 'info' }
  ]);

  // Form State for Requesting UIL Support Letter
  const [newRequest, setNewRequest] = useState({
    company: '',
    position: '',
    location: 'Addis Ababa',
    period: 'July 2026 - Sept 2026',
    formatUsed: 'Standard Engineering Bio-Data'
  });

  // Logbook New Entry Form
  const [newLog, setNewLog] = useState({
    summary: '',
    hoursLogged: 40
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!newRequest.company || !newRequest.position) return;

    const createdApp = {
      id: `APP-2026-00${applications.length + 1}`,
      company: newRequest.company,
      position: newRequest.position,
      location: newRequest.location,
      period: newRequest.period,
      appliedDate: new Date().toISOString().split('T')[0],
      uilStatus: 'Pending',
      qrCodeValid: false,
      stage: 'UIL Pending',
      formatUsed: newRequest.formatUsed,
      mentorAssigned: 'Unassigned',
      studentId: 'ETS1042/14',
      studentName: 'Abebe Tadesse',
      department: 'Software Engineering',
      gpa: '3.78'
    };

    setApplications([createdApp, ...applications]);
    setIsLetterModalOpen(false);
    
    // Add simulated Telegram notification
    const newAlert = {
      id: Date.now(),
      time: 'Just now',
      message: `📤 Support letter request submitted for ${newRequest.company}. Pending UIL approval.`,
      type: 'info'
    };
    setTelegramAlerts([newAlert, ...telegramAlerts]);

    // Reset Form
    setNewRequest({
      company: '',
      position: '',
      location: 'Addis Ababa',
      period: 'July 2026 - Sept 2026',
      formatUsed: 'Standard Engineering Bio-Data'
    });
  };

  const handleApproveUIL = (id) => {
    setApplications(applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          uilStatus: 'Approved',
          qrCodeValid: true,
          stage: app.stage === 'UIL Pending' ? 'Letter Issued' : app.stage
        };
      }
      return app;
    }));

    const appName = applications.find(a => a.id === id)?.company;
    setTelegramAlerts([
      {
        id: Date.now(),
        time: 'Just now',
        message: `✅ UIL Letter for ${appName} digitally stamped & signed with verification QR!`,
        type: 'success'
      },
      ...telegramAlerts
    ]);
  };

  const handleUpdateStage = (id, newStage) => {
    setApplications(applications.map(app => {
      if (app.id === id) {
        return { ...app, stage: newStage };
      }
      return app;
    }));
  };

  const handleAddLogbook = (e) => {
    e.preventDefault();
    if (!newLog.summary) return;

    const entry = {
      week: logbooks.length + 1,
      dateRange: `Week ${logbooks.length + 1} Entry`,
      summary: newLog.summary,
      hoursLogged: Number(newLog.hoursLogged),
      status: 'Pending Review',
      mentorFeedback: '',
      rating: 0
    };

    setLogbooks([...logbooks, entry]);
    setNewLog({ summary: '', hoursLogged: 40 });
  };

  return (
    <div className={`min-h-screen ${lowDataMode ? 'bg-gray-100 text-gray-900 font-sans' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Branding */}
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600 p-2 rounded-lg flex items-center justify-center font-bold text-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-wide flex items-center gap-2">
                  InternBridge <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded border border-emerald-500/30">UIL Ethiopia</span>
                </span>
                <p className="text-xs text-slate-400 hidden sm:block">University-Industry Linkage & Tracking Portal</p>
              </div>
            </div>

            {/* Role Switcher & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Low-Data Mode Toggle */}
              <button 
                onClick={() => setLowDataMode(!lowDataMode)}
                className={`flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-md transition ${
                  lowDataMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Toggle Low-Bandwidth Mode for slow internet speed"
              >
                {lowDataMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden md:inline">{lowDataMode ? 'Low Data Active' : 'High Speed'}</span>
              </button>

              {/* View Switcher */}
              <div className="bg-slate-800 p-1 rounded-lg flex space-x-1 text-xs font-medium border border-slate-700">
                <button
                  onClick={() => setCurrentRole('student')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    currentRole === 'student' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setCurrentRole('uil_admin')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    currentRole === 'uil_admin' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  UIL Office
                </button>
                <button
                  onClick={() => setCurrentRole('company')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    currentRole === 'company' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Recruiter
                </button>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* User Context Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-emerald-400 font-bold flex items-center justify-center text-sm">
              {currentRole === 'student' && 'AT'}
              {currentRole === 'uil_admin' && 'AAU'}
              {currentRole === 'company' && 'ET'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {currentRole === 'student' && 'Abebe Tadesse (Student)'}
                {currentRole === 'uil_admin' && 'Addis Ababa University - UIL Office'}
                {currentRole === 'company' && 'Ethio Telecom - Talent Acquisition'}
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-normal">
                  {currentRole === 'student' && 'ID: ETS1042/14'}
                  {currentRole === 'uil_admin' && 'Central Directorate'}
                  {currentRole === 'company' && 'Partner Recruiter'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {currentRole === 'student' && 'Department of Software Engineering | 4th Year'}
                {currentRole === 'uil_admin' && 'Verification & University-Industry Support Officer Dashboard'}
                {currentRole === 'company' && 'Managing Early Career Applicants & Internship Intake'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> University Verified
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: STUDENT PORTAL                                                     */}
        {/* ========================================================================= */}
        {}
        {currentRole === 'student' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Active Applications</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</p>
                </div>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Approved UIL Letters</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                    {applications.filter(a => a.uilStatus === 'Approved').length}
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Logbook Progress</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">Week {logbooks.length}/12</p>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Assigned Mentor</p>
                  <p className="text-sm font-bold text-slate-800 mt-1 truncate">Dr. Kassahun B.</p>
                </div>
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Action & Notifications Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Application Table - Left 2 Columns */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Application Tracker</h3>
                      <p className="text-xs text-slate-500">Track company applications & UIL recommendation letters</p>
                    </div>
                    <button
                      onClick={() => setIsLetterModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Request UIL Support Letter
                    </button>
                  </div>

                  {/* Applications List Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Company & Role</th>
                          <th className="px-4 py-3">UIL Letter</th>
                          <th className="px-4 py-3">Stage</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-4 py-3.5">
                              <p className="font-bold text-slate-900">{app.company}</p>
                              <p className="text-slate-500 text-[11px]">{app.position}</p>
                              <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                                {app.formatUsed}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              {app.uilStatus === 'Approved' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stamped & QR Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3 h-3 text-amber-600" /> Pending UIL
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold inline-block ${
                                app.stage === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                                app.stage === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                                app.stage === 'Submitted' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {app.stage}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right space-x-1">
                              <button
                                onClick={() => setSelectedAppTimeline(app)}
                                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded transition"
                                title="View Stage Timeline"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {app.uilStatus === 'Approved' && (
                                <button
                                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition"
                                  title="Download Official Stamped Letter (PDF)"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Stage Timeline Card for Selected App */}
                {selectedAppTimeline && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Stage Progress: <span className="text-emerald-600">{selectedAppTimeline.company}</span>
                        </h4>
                        <p className="text-xs text-slate-500">ID: {selectedAppTimeline.id} | Position: {selectedAppTimeline.position}</p>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
                        Mentor: {selectedAppTimeline.mentorAssigned}
                      </span>
                    </div>

                    {/* Sequential Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative text-xs">
                      <div className="bg-slate-50 p-3 rounded-lg border border-emerald-200">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                          <CheckCircle2 className="w-4 h-4" /> 1. Bio-Data Standardized
                        </div>
                        <p className="text-[11px] text-slate-500">Form schema validated with standard student fields.</p>
                      </div>

                      <div className={`p-3 rounded-lg border ${
                        selectedAppTimeline.uilStatus === 'Approved' ? 'bg-slate-50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'
                      }`}>
                        <div className={`flex items-center gap-1.5 font-bold mb-1 ${
                          selectedAppTimeline.uilStatus === 'Approved' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {selectedAppTimeline.uilStatus === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          2. UIL Letter Stamped
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {selectedAppTimeline.uilStatus === 'Approved' ? 'Digitally signed with institutional QR.' : 'Waiting for UIL Office approval.'}
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg border ${
                        ['Submitted', 'Interview Scheduled', 'Accepted'].includes(selectedAppTimeline.stage)
                          ? 'bg-slate-50 border-emerald-200'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                          <Send className="w-3.5 h-3.5" /> 3. Company Review
                        </div>
                        <p className="text-[11px] text-slate-500">Recruiter evaluating applicant credentials.</p>
                      </div>

                      <div className={`p-3 rounded-lg border ${
                        selectedAppTimeline.stage === 'Accepted' ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                          <Award className="w-3.5 h-3.5" /> 4. Placement Confirmed
                        </div>
                        <p className="text-[11px] text-slate-500">Company acceptance slip logged & advisor visit set.</p>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Sidebar: Telegram Mirror & Official Verification Card */}
              <div className="space-y-4">
                
                {/* Telegram Bot Simulation Box */}
                <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-800">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-sky-400" />
                      <span className="font-bold text-xs">Telegram Bot Sync (@InternBridge_Bot)</span>
                    </div>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3">
                    Live mobile alerts sent via Telegram without requiring heavy mobile app downloads.
                  </p>

                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {telegramAlerts.map(alert => (
                      <div key={alert.id} className="bg-slate-800/90 border border-slate-700/60 p-2.5 rounded-lg text-xs">
                        <p className="text-slate-200 text-[11px] leading-relaxed">{alert.message}</p>
                        <span className="text-[10px] text-slate-500 block mt-1">{alert.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification QR Card Sample */}
                <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-sm border border-emerald-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300">Digital Letter Verification</h4>
                      <p className="text-xs text-emerald-100 font-semibold mt-0.5">Official Support Letter (ማመልከቻ)</p>
                    </div>
                    <QrCode className="w-8 h-8 text-emerald-300" />
                  </div>
                  <p className="text-[11px] text-emerald-200/80 mt-2 leading-relaxed">
                    Recruiters scan the QR code printed on university letters to instantly verify authenticity against university records.
                  </p>
                </div>

              </div>

            </div>

            {/* Weekly Logbook Interactive Module */}
            {}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Student Internship Logbook</h3>
                  <p className="text-xs text-slate-500">Record weekly practical tasks for Academic Mentor evaluation</p>
                </div>
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                  Requirement: 12 Weekly Entries
                </span>
              </div>

              {/* Logbook Grid: Submit Form + Past Entries */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Submit New Entry */}
                <form onSubmit={handleAddLogbook} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800">Add Entry for Week {logbooks.length + 1}</h4>
                  
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Hours Worked</label>
                    <input 
                      type="number"
                      value={newLog.hoursLogged}
                      onChange={(e) => setNewLog({ ...newLog, hoursLogged: e.target.value })}
                      className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Summary of Practical Activities</label>
                    <textarea
                      rows={3}
                      value={newLog.summary}
                      onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
                      placeholder="Describe technical tasks, tools used, and challenges overcome..."
                      className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded transition flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Log to Mentor
                  </button>
                </form>

                {/* Logbook Timeline Table */}
                <div className="lg:col-span-2 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                      <tr>
                        <th className="px-3 py-2">Week</th>
                        <th className="px-3 py-2">Summary</th>
                        <th className="px-3 py-2">Hours</th>
                        <th className="px-3 py-2">Status & Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logbooks.map((log) => (
                        <tr key={log.week} className="hover:bg-slate-50/60">
                          <td className="px-3 py-3 font-bold text-slate-800">W{log.week}</td>
                          <td className="px-3 py-3">
                            <p className="text-slate-800 font-medium leading-tight">{log.summary}</p>
                            {log.mentorFeedback && (
                              <p className="text-[11px] text-purple-700 bg-purple-50 p-1.5 rounded mt-1 border border-purple-100">
                                💬 <strong>Mentor:</strong> {log.mentorFeedback}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-3 font-mono">{log.hoursLogged} hrs</td>
                          <td className="px-3 py-3">
                            {log.status === 'Approved' ? (
                              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                                Approved ({log.rating}/5 ⭐)
                              </span>
                            ) : (
                              <span className="inline-block bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">
                                Pending Mentor
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: UIL ADMIN PORTAL                                                  */}
        {/* ========================================================================= */}
        {}
        {currentRole === 'uil_admin' && (
          <div className="space-y-6">
            
            {/* UIL Overview stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Pending Requests Queue</p>
                  <p className="text-2xl font-extrabold text-amber-600 mt-1">
                    {applications.filter(a => a.uilStatus === 'Pending').length}
                  </p>
                </div>
                <Clock className="w-6 h-6 text-amber-500" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Issued Stamped Letters</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                    {applications.filter(a => a.uilStatus === 'Approved').length}
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Partner Host Companies</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">48</p>
                </div>
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
            </div>

            {/* Letter Verification Queue */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Support Letter Verification Queue (ማመልከቻ)</h3>
                  <p className="text-xs text-slate-500">Review student application formatting and issue digital stamps</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono">
                  Batch Seal Ready
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Student Info</th>
                      <th className="px-4 py-3">Target Company</th>
                      <th className="px-4 py-3">Format Schema</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-900">{app.studentName}</p>
                          <p className="text-slate-500 text-[11px]">{app.studentId} | GPA: {app.gpa}</p>
                          <p className="text-[10px] text-slate-400">{app.department}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-800">{app.company}</p>
                          <p className="text-slate-500 text-[11px]">{app.position}</p>
                          <p className="text-[10px] text-slate-400">{app.location}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                            {app.formatUsed}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {app.uilStatus === 'Approved' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Stamped & QR Code Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Office Approval
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {app.uilStatus === 'Pending' ? (
                            <button
                              onClick={() => handleApproveUIL(app.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded text-xs transition inline-flex items-center gap-1"
                            >
                              <QrCode className="w-3.5 h-3.5" /> Approve & Generate QR
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Approved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* University Industry Metrics */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Campus Placement Distribution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-500">Telecom & Network Sector</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">42% Placement</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-500">FinTech & Banking Sector</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">35% Placement</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-500">Government & Defense Tech</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">23% Placement</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: COMPANY RECRUITER PORTAL                                         */}
        {/* ========================================================================= */}
        {}
        {currentRole === 'company' && (
          <div className="space-y-6">
            
            {/* Recruiter Header Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Ethio Telecom Applicant Pipeline</h3>
                <p className="text-xs text-slate-500">Review standardized student applications with verified university support letters</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full">
                  Official Industry Partner
                </span>
              </div>
            </div>

            {/* Applicants List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.map((app) => (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  
                  {/* Top card metadata */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{app.studentName}</h4>
                      <p className="text-xs text-slate-500">{app.department} | {app.studentId}</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-0.5">Cumulative GPA: {app.gpa}</p>
                    </div>
                    {app.uilStatus === 'Approved' ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <QrCode className="w-3 h-3" /> UIL Verified
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        Pending Letter
                      </span>
                    )}
                  </div>

                  {/* Applied Position Details */}
                  <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-slate-700"><strong>Applied Role:</strong> {app.position}</p>
                    <p className="text-slate-700"><strong>Preferred Location:</strong> {app.location}</p>
                    <p className="text-slate-700"><strong>Internship Window:</strong> {app.period}</p>
                  </div>

                  {/* Recruiter Stage Action Buttons */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase">Update Application Stage</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleUpdateStage(app.id, 'Submitted')}
                        className={`text-xs py-1.5 px-2 rounded font-medium border text-center transition ${
                          app.stage === 'Submitted' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Under Review
                      </button>
                      <button
                        onClick={() => handleUpdateStage(app.id, 'Interview Scheduled')}
                        className={`text-xs py-1.5 px-2 rounded font-medium border text-center transition ${
                          app.stage === 'Interview Scheduled' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => handleUpdateStage(app.id, 'Accepted')}
                        className={`text-xs py-1.5 px-2 rounded font-medium border text-center transition ${
                          app.stage === 'Accepted' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Accept Student
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: REQUEST UIL SUPPORT LETTER                                         */}
      {/* ========================================================================= */}
      {}
      {isLetterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Request Official UIL Support Letter</h3>
                <p className="text-xs text-slate-500">Generate university recommendation letter (ማመልከቻ)</p>
              </div>
              <button 
                onClick={() => setIsLetterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Host Organization Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Commercial Bank of Ethiopia, Safaricom, INSA"
                  value={newRequest.company}
                  onChange={(e) => setNewRequest({ ...newRequest, company: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Internship Position</label>
                <input 
                  type="text" 
                  placeholder="e.g. Software Engineering Intern, IT Trainee"
                  value={newRequest.position}
                  onChange={(e) => setNewRequest({ ...newRequest, position: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <select 
                    value={newRequest.location}
                    onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Dire Dawa">Dire Dawa</option>
                    <option value="Hawassa">Hawassa</option>
                    <option value="Bahir Dar">Bahir Dar</option>
                    <option value="Adama">Adama</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard Bio-Data Schema</label>
                  <select 
                    value={newRequest.formatUsed}
                    onChange={(e) => setNewRequest({ ...newRequest, formatUsed: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Standard Engineering Bio-Data">Software/Tech Format</option>
                    <option value="FinTech Standard Format">Finance/Business Format</option>
                    <option value="Security Clearance Standard">Government Format</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Automatic Information Included:</p>
                <p>• Student Name: Abebe Tadesse (ID: ETS1042/14)</p>
                <p>• Department: Software Engineering (Cumulative GPA: 3.78)</p>
                <p>• Official Registrar Verification Stamp & QR Code</p>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLetterModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow"
                >
                  Submit Request
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Ethiopian Universities Linkage Portal (InternBridge). Standardized for Higher Education Institutions.</p>
      </footer>

    </div>
  );
}
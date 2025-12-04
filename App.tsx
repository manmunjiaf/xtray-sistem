import React, { useEffect, useState, useMemo } from 'react';
import { 
  AlertCircle, 
  Check, 
  ChevronDown, 
  Clock, 
  Download, 
  FileText, 
  LogOut, 
  Plus, 
  Search, 
  User as UserIcon, 
  X,
  Activity,
  Calendar,
  Settings
} from 'lucide-react';
import { TRANSLATIONS, UITM_LOGO_URL } from './constants';
import { 
  BodyPartOption, 
  Language, 
  RequestStatus, 
  Role, 
  User, 
  XRayRequest 
} from './types';
import * as db from './services/db';
import { getClinicalAdvice } from './services/geminiService';

// --- Sub-components to keep file organized ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-uitm-primary px-4 py-3 flex justify-between items-center">
          <h3 className="text-white font-medium">{title}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>(Language.MS);
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD'>('LOGIN');
  
  // Data State
  const [requests, setRequests] = useState<XRayRequest[]>([]);
  const [parts, setParts] = useState<BodyPartOption[]>([]);
  
  // Initialize DB
  useEffect(() => {
    db.initDB();
    setParts(db.getParts());
  }, []);

  // Helpers
  const t = (key: string) => (TRANSLATIONS[lang] as any)[key] || key;
  const refreshRequests = () => setRequests(db.getRequests().sort((a, b) => b.createdAt - a.createdAt));

  const handleLogin = (u: User) => {
    setCurrentUser(u);
    setView('DASHBOARD');
    refreshRequests();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('LOGIN');
  };

  if (view === 'LOGIN') {
    return (
      <LoginView 
        lang={lang} 
        setLang={setLang} 
        onLogin={handleLogin} 
        t={t} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-uitm-primary text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={UITM_LOGO_URL} alt="UiTM Logo" className="h-10 w-auto bg-white rounded-full p-0.5" />
              <div className="hidden md:block">
                <span className="font-bold text-lg block leading-tight">UiTM Health</span>
                <span className="text-xs text-uitm-secondary block">X-Ray Management System</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="opacity-75">{currentUser?.fullName}</span>
                <span className="bg-uitm-secondary text-uitm-primary px-2 py-0.5 rounded text-xs font-bold">
                  {t(currentUser?.role || '')}
                </span>
              </div>
              <button 
                onClick={() => setLang(lang === Language.MS ? Language.EN : Language.MS)}
                className="p-2 hover:bg-white/10 rounded"
              >
                {lang}
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:bg-red-600 px-3 py-2 rounded transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentUser?.role === Role.DOCTOR && (
          <DoctorDashboard 
            user={currentUser} 
            requests={requests} 
            parts={parts} 
            onUpdate={refreshRequests} 
            lang={lang} 
            t={t} 
          />
        )}
        {currentUser?.role === Role.RADIOGRAPHER && (
          <RadiographerDashboard 
            user={currentUser} 
            requests={requests} 
            onUpdate={refreshRequests} 
            lang={lang} 
            t={t} 
          />
        )}
        {currentUser?.role === Role.ADMIN && (
          <AdminDashboard 
            user={currentUser}
            requests={requests}
            parts={parts}
            onUpdateParts={() => setParts(db.getParts())}
            onUpdateRequests={refreshRequests}
            lang={lang}
            t={t}
          />
        )}
      </main>
    </div>
  );
};

// --- Login Component ---

const LoginView = ({ lang, setLang, onLogin, t }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = db.verifyUser(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError(lang === Language.MS ? 'Kredensial tidak sah' : 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-uitm-primary p-8 text-center relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
           <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-uitm-secondary opacity-20 rounded-full"></div>
           
           <img src={UITM_LOGO_URL} alt="UiTM" className="h-24 mx-auto mb-4 bg-white rounded-full p-2 shadow-lg" />
           <h1 className="text-2xl font-bold text-white">{t('loginTitle')}</h1>
        </div>
        <div className="p-8">
          <div className="flex justify-end mb-4">
             <button 
                onClick={() => setLang(lang === Language.MS ? Language.EN : Language.MS)}
                className="text-xs font-medium text-uitm-primary hover:underline"
              >
                Change Language ({lang})
              </button>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('username')}</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-uitm-primary focus:border-uitm-primary outline-none transition"
                  placeholder="email@uitm.edu.my"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-uitm-primary focus:border-uitm-primary outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-uitm-primary hover:bg-uitm-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow transition transform hover:scale-[1.02]"
            >
              {t('loginBtn')}
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-500">
            &copy; Universiti Teknologi MARA
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Doctor Dashboard ---

const DoctorDashboard = ({ user, requests, parts, onUpdate, lang, t }: any) => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'LIST'>('NEW');
  
  // Form State
  const [formData, setFormData] = useState<Partial<XRayRequest>>({
    gender: 'Male',
    parts: []
  });
  const [advice, setAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const myRequests = requests.filter((r: XRayRequest) => r.doctorId === user.username);

  const handlePartToggle = (part: BodyPartOption) => {
    const current = formData.parts || [];
    const exists = current.find(p => p.id === part.id);
    if (exists) {
      setFormData({ ...formData, parts: current.filter(p => p.id !== part.id) });
    } else {
      setFormData({ ...formData, parts: [...current, part] });
    }
  };

  const getAiAdvice = async () => {
    if (!formData.history || !formData.parts?.length) return;
    setLoadingAdvice(true);
    const result = await getClinicalAdvice(formData.history, formData.parts, lang);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.icNumber || !formData.parts?.length) {
      alert("Please fill in required fields.");
      return;
    }

    const newRequest: XRayRequest = {
      id: editingId || Date.now().toString(),
      doctorId: user.username,
      doctorName: user.fullName,
      patientName: formData.patientName!,
      icNumber: formData.icNumber!,
      uitmId: formData.uitmId || '',
      gender: formData.gender as 'Male'|'Female',
      lmpDate: formData.gender === 'Female' ? formData.lmpDate : undefined,
      history: formData.history || '',
      parts: formData.parts!,
      status: RequestStatus.PENDING,
      createdAt: editingId ? (requests.find((r: XRayRequest) => r.id === editingId)?.createdAt || Date.now()) : Date.now(),
    };

    db.saveRequest(newRequest);
    onUpdate();
    resetForm();
    setActiveTab('LIST');
  };

  const resetForm = () => {
    setFormData({ gender: 'Male', parts: [] });
    setAdvice('');
    setEditingId(null);
  };

  const handleEdit = (req: XRayRequest) => {
    if (req.status !== RequestStatus.PENDING) return;
    setFormData(req);
    setEditingId(req.id);
    setActiveTab('NEW');
  };

  // Group parts by category
  const partsByCategory = useMemo(() => {
    const groups: {[key: string]: BodyPartOption[]} = {};
    parts.forEach((p: BodyPartOption) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [parts]);

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('NEW')}
          className={`pb-2 px-4 font-medium ${activeTab === 'NEW' ? 'text-uitm-primary border-b-2 border-uitm-primary' : 'text-gray-500'}`}
        >
          {editingId ? t('update') : t('newRequest')}
        </button>
        <button 
          onClick={() => { setActiveTab('LIST'); resetForm(); }}
          className={`pb-2 px-4 font-medium ${activeTab === 'LIST' ? 'text-uitm-primary border-b-2 border-uitm-primary' : 'text-gray-500'}`}
        >
          {t('myRequests')}
        </button>
      </div>

      {activeTab === 'NEW' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-uitm-primary">{t('newRequest')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('patientName')}*</label>
                  <input required className="w-full border rounded p-2" value={formData.patientName || ''} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('icNumber')}*</label>
                  <input required className="w-full border rounded p-2" value={formData.icNumber || ''} onChange={e => setFormData({...formData, icNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('uitmId')}</label>
                  <input className="w-full border rounded p-2" value={formData.uitmId || ''} onChange={e => setFormData({...formData, uitmId: e.target.value})} />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">{t('gender')}</label>
                    <select className="w-full border rounded p-2" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                      <option value="Male">{t('male')}</option>
                      <option value="Female">{t('female')}</option>
                    </select>
                  </div>
                  {formData.gender === 'Female' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">{t('lmpDate')}*</label>
                      <input type="date" required className="w-full border rounded p-2" value={formData.lmpDate || ''} onChange={e => setFormData({...formData, lmpDate: e.target.value})} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('selectParts')}*</label>
                <div className="border rounded p-4 max-h-60 overflow-y-auto bg-gray-50">
                   {Object.keys(partsByCategory).map(cat => (
                     <div key={cat} className="mb-3">
                       <h4 className="font-bold text-xs text-gray-500 uppercase mb-1">{cat}</h4>
                       <div className="grid grid-cols-2 gap-2">
                         {partsByCategory[cat].map(p => (
                           <label key={p.id} className="flex items-center space-x-2 bg-white p-2 rounded border hover:bg-gray-50 cursor-pointer">
                             <input 
                                type="checkbox" 
                                checked={!!formData.parts?.find(x => x.id === p.id)}
                                onChange={() => handlePartToggle(p)}
                                className="text-uitm-primary focus:ring-uitm-primary"
                             />
                             <span className="text-sm">{p.projection}</span>
                           </label>
                         ))}
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('history')}*</label>
                <textarea required rows={3} className="w-full border rounded p-2" value={formData.history || ''} onChange={e => setFormData({...formData, history: e.target.value})} />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                {editingId && <button type="button" onClick={() => {resetForm(); setActiveTab('LIST')}} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">{t('cancel')}</button>}
                <button type="submit" className="px-6 py-2 bg-uitm-primary text-white rounded hover:bg-uitm-primary/90 font-medium">
                  {editingId ? t('save') : t('submit')}
                </button>
              </div>
            </form>
          </div>

          {/* AI Advice Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow p-6 border border-blue-100">
              <div className="flex items-center space-x-2 mb-4 text-uitm-primary">
                 <Activity size={20} />
                 <h3 className="font-bold">{t('adviceTitle')}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Fill history and select parts, then click below to get AI-powered clinical guidelines.
              </p>
              
              <button 
                onClick={getAiAdvice}
                disabled={loadingAdvice || !formData.history || !formData.parts?.length}
                className="w-full bg-white border border-uitm-primary text-uitm-primary hover:bg-uitm-primary hover:text-white py-2 px-4 rounded transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAdvice ? t('loading') : t('getAdvice')}
              </button>

              {advice && (
                <div className="bg-white p-4 rounded border border-gray-200 text-sm space-y-2 max-h-80 overflow-y-auto prose prose-sm">
                   <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('patientName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myRequests.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">{t('noData')}</td></tr>
              ) : (
                myRequests.map((req: XRayRequest) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{req.patientName}</div>
                      <div className="text-xs text-gray-500">{req.icNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {req.parts.length} parts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <StatusBadge status={req.status} t={t} />
                       {req.status === RequestStatus.REJECTED && (
                         <div className="text-xs text-red-600 mt-1 max-w-[150px] truncate" title={req.rejectedReason}>Reason: {req.rejectedReason}</div>
                       )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {req.status === RequestStatus.PENDING ? (
                        <button onClick={() => handleEdit(req)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      ) : (
                        <span className="text-gray-400 cursor-not-allowed">Locked</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Radiographer Dashboard ---

const RadiographerDashboard = ({ user, requests, onUpdate, lang, t }: any) => {
  const [selectedReq, setSelectedReq] = useState<XRayRequest | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [doseModalOpen, setDoseModalOpen] = useState(false);
  
  const [rejectReason, setRejectReason] = useState('');
  const [doses, setDoses] = useState<{[key: string]: string}>({});

  const pendingRequests = requests.filter((r: XRayRequest) => r.status === RequestStatus.PENDING || (r.status === RequestStatus.ACCEPTED && !r.examEndTimestamp));
  
  // Handlers
  const handleAccept = (req: XRayRequest) => {
    db.updateRequestStatus(req.id, {
      status: RequestStatus.ACCEPTED,
      radiographerId: user.username,
      radiographerName: user.fullName,
    });
    onUpdate();
  };

  const handleRejectClick = (req: XRayRequest) => {
    setSelectedReq(req);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedReq && rejectReason) {
      db.updateRequestStatus(selectedReq.id, {
        status: RequestStatus.REJECTED,
        radiographerId: user.username,
        radiographerName: user.fullName,
        rejectedReason: rejectReason
      });
      setRejectModalOpen(false);
      setSelectedReq(null);
      onUpdate();
    }
  };

  const handleUpdateTimestamp = (req: XRayRequest, field: 'arrivalTimestamp' | 'examStartTimestamp') => {
    db.updateRequestStatus(req.id, { [field]: Date.now() });
    onUpdate();
  };

  const handleFinishClick = (req: XRayRequest) => {
    setSelectedReq(req);
    // Initialize doses object
    const initialDoses: any = {};
    req.parts.forEach(p => initialDoses[p.id] = '');
    setDoses(initialDoses);
    setDoseModalOpen(true);
  };

  const confirmFinish = () => {
    if (selectedReq) {
      const doseRecords = Object.entries(doses).map(([partId, doseAmount]) => ({ partId, doseAmount: doseAmount as string }));
      db.updateRequestStatus(selectedReq.id, {
        status: RequestStatus.COMPLETED,
        examEndTimestamp: Date.now(),
        doses: doseRecords
      });
      setDoseModalOpen(false);
      setSelectedReq(null);
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-uitm-primary">{t('pendingRequests')}</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {pendingRequests.length === 0 ? (
          <div className="p-12 text-center bg-white rounded shadow text-gray-500">{t('noData')}</div>
        ) : (
          pendingRequests.map((req: XRayRequest) => (
            <div key={req.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-uitm-secondary flex flex-col md:flex-row justify-between">
               <div className="flex-1 space-y-2">
                 <div className="flex items-center space-x-2">
                   <h3 className="text-lg font-bold">{req.patientName}</h3>
                   <span className="text-xs bg-gray-100 px-2 py-1 rounded">{req.icNumber}</span>
                   <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{req.gender}</span>
                 </div>
                 <div className="text-sm text-gray-600">
                    <p><strong>Request by:</strong> {req.doctorName}</p>
                    <p><strong>History:</strong> {req.history}</p>
                    <div className="mt-2">
                      <strong className="block mb-1">Requested Parts:</strong>
                      <div className="flex flex-wrap gap-2">
                        {req.parts.map(p => (
                          <span key={p.id} className="text-xs bg-uitm-primary text-white px-2 py-1 rounded">
                            {p.category} - {p.projection}
                          </span>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>
               
               <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2 min-w-[200px] justify-center">
                 {req.status === RequestStatus.PENDING && (
                   <>
                    <button onClick={() => handleAccept(req)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center">
                      <Check size={16} className="mr-2" /> {t('accept')}
                    </button>
                    <button onClick={() => handleRejectClick(req)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center">
                      <X size={16} className="mr-2" /> {t('reject')}
                    </button>
                   </>
                 )}
                 
                 {req.status === RequestStatus.ACCEPTED && (
                   <div className="space-y-2">
                     {!req.arrivalTimestamp && (
                       <button onClick={() => handleUpdateTimestamp(req, 'arrivalTimestamp')} className="w-full bg-blue-500 text-white px-4 py-2 rounded text-sm">
                         Mark Arrived
                       </button>
                     )}
                     {req.arrivalTimestamp && !req.examStartTimestamp && (
                       <button onClick={() => handleUpdateTimestamp(req, 'examStartTimestamp')} className="w-full bg-purple-500 text-white px-4 py-2 rounded text-sm">
                         Start Exam
                       </button>
                     )}
                     {req.examStartTimestamp && (
                       <button onClick={() => handleFinishClick(req)} className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm font-bold">
                         {t('finishExam')}
                       </button>
                     )}
                     
                     <div className="text-xs text-gray-400 mt-2 space-y-1">
                        {req.arrivalTimestamp && <div className="flex items-center"><Clock size={12} className="mr-1"/> Arrived: {new Date(req.arrivalTimestamp).toLocaleTimeString()}</div>}
                        {req.examStartTimestamp && <div className="flex items-center"><Clock size={12} className="mr-1"/> Started: {new Date(req.examStartTimestamp).toLocaleTimeString()}</div>}
                     </div>
                   </div>
                 )}
               </div>
            </div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title={t('rejectReason')}>
        <textarea 
          className="w-full border rounded p-2 h-32 mb-4" 
          placeholder="State reason for rejection..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
        <div className="flex justify-end">
          <button onClick={confirmReject} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">{t('reject')}</button>
        </div>
      </Modal>

      {/* Dose Modal */}
      <Modal isOpen={doseModalOpen} onClose={() => setDoseModalOpen(false)} title={t('enterDose')}>
        <div className="space-y-4 mb-4">
          <p className="text-sm text-gray-600">Please enter dose (e.g., mGy) for each examined part.</p>
          {selectedReq?.parts.map(p => (
            <div key={p.id}>
              <label className="block text-xs font-bold text-gray-700">{p.category} ({p.projection})</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 mt-1" 
                placeholder="e.g. 2.5 mGy"
                value={doses[p.id] || ''}
                onChange={(e) => setDoses({...doses, [p.id]: e.target.value})}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button onClick={confirmFinish} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Complete</button>
        </div>
      </Modal>
    </div>
  );
};

// --- Admin Dashboard ---

const AdminDashboard = ({ user, requests, parts, onUpdateParts, onUpdateRequests, lang, t }: any) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'PARTS' | 'REPORTS'>('USERS');
  const [newUser, setNewUser] = useState<Partial<User>>({ role: Role.DOCTOR });
  const [newPart, setNewPart] = useState({ category: '', projection: '' });
  const [reportFilter, setReportFilter] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.username && newUser.password && newUser.fullName && newUser.role) {
      try {
        db.addUser(newUser as User);
        setNewUser({ role: Role.DOCTOR, username: '', password: '', fullName: '' });
        alert("User added successfully");
      } catch (err) {
        alert("Error adding user: Username may exist");
      }
    }
  };

  // Add Part
  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPart.category && newPart.projection) {
      const updatedParts = [...parts, { ...newPart, id: Date.now().toString() }];
      db.saveParts(updatedParts);
      onUpdateParts();
      setNewPart({ category: '', projection: '' });
    }
  };
  
  const handleRemovePart = (id: string) => {
    if(confirm("Are you sure?")) {
        const updatedParts = parts.filter((p: BodyPartOption) => p.id !== id);
        db.saveParts(updatedParts);
        onUpdateParts();
    }
  };

  // CSV Export
  const downloadCSV = () => {
    // Filter requests by month/year based on examEndTimestamp (for completed) or createdAt
    const filtered = requests.filter((r: XRayRequest) => {
      const d = new Date(r.examEndTimestamp || r.createdAt);
      return d.getMonth() + 1 === parseInt(reportFilter.month as any) && d.getFullYear() === parseInt(reportFilter.year as any);
    });

    const headers = [
      "Patient Name", "IC", "UiTM ID", "Gender", "LMP", "History", 
      "Parts", "Status", "Request Date", "Exam Start", "Exam End", 
      "Doctor", "Radiographer", "Doses"
    ];

    const rows = filtered.map((r: XRayRequest) => [
      `"${r.patientName}"`,
      `"${r.icNumber}"`,
      `"${r.uitmId || ''}"`,
      r.gender,
      r.lmpDate || 'N/A',
      `"${r.history.replace(/"/g, '""')}"`,
      `"${r.parts.map(p => p.category + '-' + p.projection).join(', ')}"`,
      r.status,
      new Date(r.createdAt).toLocaleString(),
      r.examStartTimestamp ? new Date(r.examStartTimestamp).toLocaleString() : '',
      r.examEndTimestamp ? new Date(r.examEndTimestamp).toLocaleString() : '',
      `"${r.doctorName}"`,
      `"${r.radiographerName || ''}"`,
      `"${r.doses?.map(d => d.doseAmount).join(', ') || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r: any[]) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${reportFilter.year}_${reportFilter.month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow min-h-[500px]">
      <div className="border-b flex">
        <button onClick={() => setActiveTab('USERS')} className={`px-6 py-4 font-medium ${activeTab === 'USERS' ? 'border-b-2 border-uitm-primary text-uitm-primary' : 'text-gray-500'}`}>{t('manageUsers')}</button>
        <button onClick={() => setActiveTab('PARTS')} className={`px-6 py-4 font-medium ${activeTab === 'PARTS' ? 'border-b-2 border-uitm-primary text-uitm-primary' : 'text-gray-500'}`}>{t('manageParts')}</button>
        <button onClick={() => setActiveTab('REPORTS')} className={`px-6 py-4 font-medium ${activeTab === 'REPORTS' ? 'border-b-2 border-uitm-primary text-uitm-primary' : 'text-gray-500'}`}>{t('reports')}</button>
      </div>
      
      <div className="p-6">
        {activeTab === 'USERS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{t('addUser')}</h3>
              <form onSubmit={handleAddUser} className="space-y-3">
                <input className="w-full border rounded p-2" placeholder="Full Name" required value={newUser.fullName || ''} onChange={e => setNewUser({...newUser, fullName: e.target.value})} />
                <input className="w-full border rounded p-2" placeholder="Email/Username" required value={newUser.username || ''} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                <input className="w-full border rounded p-2" placeholder="Password" type="password" required value={newUser.password || ''} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                <select className="w-full border rounded p-2" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as Role})}>
                  <option value={Role.DOCTOR}>Doctor</option>
                  <option value={Role.RADIOGRAPHER}>Radiographer</option>
                  <option value={Role.ADMIN}>Admin</option>
                </select>
                <button className="bg-uitm-primary text-white px-4 py-2 rounded w-full hover:bg-uitm-primary/90">{t('addUser')}</button>
              </form>
            </div>
            <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
               <h3 className="font-bold mb-2">Existing Users</h3>
               <ul className="space-y-2">
                 {db.getUsers().map(u => (
                   <li key={u.username} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                     <div>
                       <div className="font-medium">{u.fullName}</div>
                       <div className="text-xs text-gray-500">{u.username} ({u.role})</div>
                     </div>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        )}

        {activeTab === 'PARTS' && (
          <div>
            <div className="flex space-x-2 mb-6">
              <input className="border rounded p-2 flex-1" placeholder="Category (e.g. Chest)" value={newPart.category} onChange={e => setNewPart({...newPart, category: e.target.value})} />
              <input className="border rounded p-2 flex-1" placeholder="Projection (e.g. PA)" value={newPart.projection} onChange={e => setNewPart({...newPart, projection: e.target.value})} />
              <button onClick={handleAddPart} className="bg-green-600 text-white px-4 py-2 rounded flex items-center"><Plus size={16} className="mr-1"/> {t('addPart')}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {parts.map((p: BodyPartOption) => (
                <div key={p.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                  <span>{p.category} - <strong>{p.projection}</strong></span>
                  <button onClick={() => handleRemovePart(p.id)} className="text-red-500 hover:text-red-700"><X size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'REPORTS' && (
          <div>
             <div className="flex items-end space-x-4 mb-8 bg-gray-50 p-4 rounded">
               <div>
                 <label className="block text-sm font-medium mb-1">{t('month')}</label>
                 <select className="border rounded p-2 w-32" value={reportFilter.month} onChange={e => setReportFilter({...reportFilter, month: parseInt(e.target.value)})}>
                   {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">{t('year')}</label>
                 <select className="border rounded p-2 w-32" value={reportFilter.year} onChange={e => setReportFilter({...reportFilter, year: parseInt(e.target.value)})}>
                   <option value={2023}>2023</option>
                   <option value={2024}>2024</option>
                   <option value={2025}>2025</option>
                 </select>
               </div>
               <button onClick={downloadCSV} className="bg-uitm-primary text-white px-4 py-2 rounded flex items-center hover:bg-uitm-primary/90">
                 <Download size={16} className="mr-2" /> {t('exportCSV')}
               </button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="min-w-full text-xs">
                 <thead className="bg-gray-100">
                   <tr>
                     <th className="p-2 text-left">Date</th>
                     <th className="p-2 text-left">Patient</th>
                     <th className="p-2 text-left">Doctor</th>
                     <th className="p-2 text-left">Radiographer</th>
                     <th className="p-2 text-left">Status</th>
                   </tr>
                 </thead>
                 <tbody>
                    {requests
                      .filter((r: XRayRequest) => {
                         const d = new Date(r.examEndTimestamp || r.createdAt);
                         return d.getMonth() + 1 === reportFilter.month && d.getFullYear() === reportFilter.year;
                      })
                      .map((r: XRayRequest) => (
                        <tr key={r.id} className="border-b">
                           <td className="p-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                           <td className="p-2">{r.patientName}</td>
                           <td className="p-2">{r.doctorName}</td>
                           <td className="p-2">{r.radiographerName || '-'}</td>
                           <td className="p-2"><StatusBadge status={r.status} t={t} /></td>
                        </tr>
                      ))
                    }
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Utilities ---

const StatusBadge = ({ status, t }: { status: RequestStatus, t: any }) => {
  const colors = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [RequestStatus.ACCEPTED]: 'bg-blue-100 text-blue-800',
    [RequestStatus.REJECTED]: 'bg-red-100 text-red-800',
    [RequestStatus.COMPLETED]: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
      {t(`status_${status}`)}
    </span>
  );
};

export default App;
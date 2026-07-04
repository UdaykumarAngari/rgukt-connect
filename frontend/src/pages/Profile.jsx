import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { usePrompt } from '../context/PromptContext';
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Award, 
  Code, 
  ExternalLink, 
  Edit, 
  Plus, 
  Trash, 
  X, 
  Upload, 
  Briefcase, 
  GraduationCap,
  UserCheck,
  UserPlus,
  Clock,
  UserMinus
} from 'lucide-react';

const Profile = ({ session, onLogout }) => {
  const { showPrompt } = usePrompt();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const isOwnProfile = !userId || Number(userId) === Number(session.id);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState('NOT_CONNECTED');
  const [connectionId, setConnectionId] = useState(null);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchConnectionStatus = async () => {
    if (isOwnProfile || !userId) return;
    try {
      const res = await axios.get(`/api/connections/status/${userId}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setConnectionStatus(res.data.status);
      setConnectionId(res.data.connectionId || null);
    } catch (err) {
      console.error('Error fetching connection status:', err);
    }
  };

  const handleConnect = async () => {
    setConnectionLoading(true);
    try {
      await axios.post(`/api/connections/request/${userId}`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      await fetchConnectionStatus();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: err.response?.data?.error || 'Failed to send connection request.' });
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!connectionId) return;
    setConnectionLoading(true);
    try {
      await axios.put(`/api/connections/accept/${connectionId}`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      await fetchConnectionStatus();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: 'Failed to accept connection request.' });
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleCancelOrDisconnect = async () => {
    if (!connectionId) return;
    setShowConfirm(false);
    setConnectionLoading(true);
    try {
      await axios.delete(`/api/connections/reject/${connectionId}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      await fetchConnectionStatus();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: 'Failed to remove connection.' });
    } finally {
      setConnectionLoading(false);
    }
  };

  const [basicForm, setBasicForm] = useState({
    mobileNumber: '',
    personalEmail: '',
    branch: 'CSE',
    batch: '',
    description: '',
    githubUrl: '',
    linkedinUrl: '',
    mentoredStudentsCount: 0
  });

  const [projectForm, setProjectForm] = useState({
    id: null,
    title: '',
    description: '',
    projectUrl: '',
    repoUrl: ''
  });

  const [expForm, setExpForm] = useState({
    id: null,
    companyName: '',
    title: '',
    location: '',
    employmentType: 'Full-time',
    locationType: 'Remote',
    startDate: '',
    endDate: '',
    isCurrentRole: false,
    description: ''
  });

  const [eduForm, setEduForm] = useState({
    id: null,
    institutionName: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    grade: ''
  });

  const [photoUploading, setPhotoUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const url = isOwnProfile ? '/api/users/profile' : `/api/users/profile/${userId}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setProfile(res.data);
      if (isOwnProfile) {
        setBasicForm({
          mobileNumber: res.data.mobileNumber || '',
          personalEmail: res.data.personalEmail || '',
          branch: res.data.branch || 'CSE',
          batch: res.data.batch || '',
          description: res.data.description || '',
          githubUrl: res.data.githubUrl || '',
          linkedinUrl: res.data.linkedinUrl || '',
          mentoredStudentsCount: res.data.mentoredStudentsCount || 0
        });
      }
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve profile data.');
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchConnectionStatus();
  }, [session, userId]);

  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile/update', basicForm, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setShowBasicModal(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: 'Failed to update basic details.' });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setPhotoUploading(true);
      await axios.put('/api/users/profile/photo', formData, {
        headers: { 
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: 'Failed to upload profile photo.' });
    } finally {
      setPhotoUploading(false);
    }
  };

  const openProjectModal = (proj = null) => {
    if (proj) {
      setProjectForm({
        id: proj.id,
        title: proj.title || '',
        description: proj.description || '',
        projectUrl: proj.projectUrl || '',
        repoUrl: proj.repoUrl || ''
      });
    } else {
      setProjectForm({ id: null, title: '', description: '', projectUrl: '', repoUrl: '' });
    }
    setShowProjectModal(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (projectForm.id) {
        await axios.put(`/api/users/profile/projects/${projectForm.id}`, projectForm, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
      } else {
        await axios.post('/api/users/profile/projects', projectForm, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
      }
      setShowProjectModal(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: 'Failed to save project.' });
    }
  };

  const handleProjectDelete = (id) => {
    showPrompt({
      type: 'confirm',
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project?',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/users/profile/projects/${id}`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          fetchProfile();
        } catch (err) {
          console.error(err);
          showPrompt({ type: 'error', message: 'Failed to delete project.' });
        }
      }
    });
  };

  const openExpModal = (exp = null) => {
    if (exp) {
      setExpForm({
        id: exp.id,
        companyName: exp.companyName || '',
        title: exp.title || '',
        location: exp.location || '',
        employmentType: exp.employmentType || 'Full-time',
        locationType: exp.locationType || 'Remote',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        isCurrentRole: exp.isCurrentRole || false,
        description: exp.description || ''
      });
    } else {
      setExpForm({
        id: null,
        companyName: '',
        title: '',
        location: '',
        employmentType: 'Full-time',
        locationType: 'Remote',
        startDate: '',
        endDate: '',
        isCurrentRole: false,
        description: ''
      });
    }
    setShowExpModal(true);
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...expForm };
      if (payload.isCurrentRole) {
        payload.endDate = null;
      }
      if (expForm.id) {
        await axios.put(`/api/users/profile/experiences/${expForm.id}`, payload, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
      } else {
        await axios.post('/api/users/profile/experiences', payload, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
      }
      setShowExpModal(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: 'Failed to save experience.' });
    }
  };

  const handleExpDelete = (id) => {
    showPrompt({
      type: 'confirm',
      title: 'Delete Experience',
      message: 'Are you sure you want to delete this experience?',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/users/profile/experiences/${id}`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          fetchProfile();
        } catch (err) {
          console.error(err);
          showPrompt({ type: 'error', message: 'Failed to delete experience.' });
        }
      }
    });
  };

  const openEduModal = (edu = null) => {
    if (edu) {
      setEduForm({
        id: edu.id,
        institutionName: edu.institutionName || '',
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        startYear: edu.startYear || '',
        endYear: edu.endYear || '',
        grade: edu.grade || ''
      });
    } else {
      setEduForm({
        id: null,
        institutionName: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        grade: ''
      });
    }
    setShowEduModal(true);
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eduForm.id) {
        await axios.put(`/api/users/profile/education/${eduForm.id}`, eduForm, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
      } else {
        await axios.post('/api/users/profile/education', eduForm, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
      }
      setShowEduModal(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      showPrompt({ type: 'error', message: 'Failed to save education.' });
    }
  };

  const handleEduDelete = (id) => {
    showPrompt({
      type: 'confirm',
      title: 'Delete Education',
      message: 'Are you sure you want to delete this education entry?',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/users/profile/education/${id}`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          fetchProfile();
        } catch (err) {
          console.error(err);
          showPrompt({ type: 'error', message: 'Failed to delete education entry.' });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rgukt-slate flex items-center justify-center font-sans">
        <div className="text-rgukt-maroon font-bold text-lg animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'UD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col font-sans">
      <Navbar isLanding={false} session={session} onLogout={onLogout} />

      <main className="flex-1 max-w-5xl mx-auto w-full pt-8 pb-60 px-4">
        {error || !profile ? (
          <div className="bg-white p-12 rounded-[32px] border border-slate-100 shadow-sm text-center max-w-md mx-auto mt-12">
            <div className="text-red-600 font-black text-xl mb-3">Error Loading Profile</div>
            <p className="text-slate-500 text-sm mb-6">{error || 'Unable to fetch profile.'}</p>
            <button 
              onClick={fetchProfile}
              className="bg-rgukt-maroon hover:bg-rgukt-maroon/90 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
          <div className="h-40 bg-gradient-to-r from-rgukt-maroon to-red-900"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-6">
              <div className="relative group">
                <div className="w-32 h-32 bg-rgukt-slate rounded-full border-4 border-white flex items-center justify-center overflow-hidden shadow-md text-4xl font-bold text-rgukt-maroon">
                  {profile.profilePhoto ? (
                    <img 
                      src={profile.profilePhoto} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(profile.name)
                  )}
                </div>
                {isOwnProfile && (
                  <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload size={18} className="mb-1" />
                    {photoUploading ? 'Uploading...' : 'Update Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={photoUploading} />
                  </label>
                )}
              </div>
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowBasicModal(true)}
                  className="bg-white border border-slate-200 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2 text-charcoal"
                >
                  <Edit size={14} className="text-rgukt-maroon"/> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  {connectionStatus === 'ACCEPTED' && (
                    <button 
                      onClick={() => setShowConfirm(true)}
                      disabled={connectionLoading}
                      className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-charcoal border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
                    >
                      <UserCheck size={16} /> Connected
                    </button>
                  )}
                  {connectionStatus === 'PENDING_SENT' && (
                    <button 
                      onClick={() => setShowConfirm(true)}
                      disabled={connectionLoading}
                      className="bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-500 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Clock size={16} /> Pending Cancel
                    </button>
                  )}
                  {connectionStatus === 'PENDING_RECEIVED' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleAccept}
                        disabled={connectionLoading}
                        className="bg-rgukt-maroon text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform cursor-pointer"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => setShowConfirm(true)}
                        disabled={connectionLoading}
                        className="border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Ignore
                      </button>
                    </div>
                  )}
                  {connectionStatus === 'NOT_CONNECTED' && (
                    <button 
                      onClick={handleConnect}
                      disabled={connectionLoading}
                      className="border border-rgukt-maroon text-rgukt-maroon hover:bg-rgukt-maroon hover:text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
                    >
                      <UserPlus size={16} /> Connect
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-black text-charcoal">{profile.name}</h1>
            <p className="text-slate-600 font-medium mt-1">
              {profile.branch} Student | Batch {profile.batch || 'N/A'}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-1"><MapPin size={16} className="text-rgukt-maroon"/> RGUKT, Basar</div>
              {profile.personalEmail && (
                <div className="flex items-center gap-1"><LinkIcon size={16} className="text-rgukt-maroon"/> {profile.personalEmail}</div>
              )}
              <div className="flex items-center gap-1"><Calendar size={16} className="text-rgukt-maroon"/> Student ID: {profile.idNumber}</div>
            </div>
          </div>
        </div>
 
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mt-6">
          <h3 className="font-bold text-charcoal text-lg mb-3">About Me</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
            {profile.description || "No bio description added yet. Tell people about yourself, your goals, and interests."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-charcoal mb-4">On the Web</h3>
              <div className="space-y-3">
                {profile.githubUrl ? (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group hover:bg-charcoal transition-all">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://www.vectorlogo.zone/logos/github/github-icon.svg" 
                        alt="GitHub" 
                        className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all"
                      />
                      <span className="text-sm font-bold group-hover:text-white transition-colors">GitHub</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-white transition-all" />
                  </a>
                ) : (
                  <p className="text-slate-400 text-xs text-center py-2">No GitHub link configured.</p>
                )}

                {profile.linkedinUrl ? (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group hover:bg-[#0077b5] transition-all">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg" 
                        alt="LinkedIn" 
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-bold group-hover:text-white transition-colors">LinkedIn</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-white transition-all" />
                  </a>
                ) : (
                  <p className="text-slate-400 text-xs text-center py-2">No LinkedIn link configured.</p>
                )}
              </div>
            </div>
 
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-charcoal mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-rgukt-maroon">{profile.mentoredStudentsCount || 0}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mentored</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-rgukt-maroon">{profile.projects ? profile.projects.length : 0}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Projects</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-charcoal flex items-center gap-2 text-lg">
                  <Briefcase className="text-rgukt-maroon" size={20}/> Work Experience
                </h3>
                {isOwnProfile && (
                  <button 
                    onClick={() => openExpModal()}
                    className="p-2 bg-slate-50 rounded-xl hover:bg-rgukt-maroon/10 hover:text-rgukt-maroon text-slate-400 transition-all cursor-pointer"
                  >
                    <Plus size={16}/>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {profile.experiences && profile.experiences.length > 0 ? (
                  profile.experiences.map(exp => (
                    <div key={exp.id} className="p-4 border border-slate-50 bg-slate-50/30 rounded-2xl flex justify-between items-start group">
                      <div>
                        <h4 className="font-bold text-charcoal">{exp.title}</h4>
                        <p className="text-xs font-semibold text-slate-500">{exp.companyName} • {exp.employmentType}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{exp.startDate} to {exp.isCurrentRole ? 'Present' : exp.endDate} • {exp.location} ({exp.locationType})</p>
                        {exp.description && (
                          <p className="text-xs text-slate-500 mt-2 whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                      {isOwnProfile && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openExpModal(exp)} className="p-1.5 text-slate-400 hover:text-rgukt-maroon rounded-lg hover:bg-slate-100"><Edit size={14}/></button>
                          <button onClick={() => handleExpDelete(exp.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"><Trash size={14}/></button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs italic text-center py-4">No experiences added yet.</p>
                )}
              </div>
            </div>
 
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-charcoal flex items-center gap-2 text-lg">
                  <Award className="text-rgukt-maroon" size={20}/> Featured Projects
                </h3>
                {isOwnProfile && (
                  <button 
                    onClick={() => openProjectModal()}
                    className="p-2 bg-slate-50 rounded-xl hover:bg-rgukt-maroon/10 hover:text-rgukt-maroon text-slate-400 transition-all cursor-pointer"
                  >
                    <Plus size={16}/>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map(proj => (
                    <div key={proj.id} className="p-5 border border-slate-50 bg-slate-50/30 rounded-2xl hover:border-rgukt-maroon/10 transition-all group flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-charcoal group-hover:text-rgukt-maroon text-base truncate">{proj.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{proj.description}</p>
                        <div className="flex gap-4 mt-3">
                          {proj.projectUrl && (
                            <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] font-bold text-rgukt-maroon hover:underline">
                              Live Demo <ExternalLink size={10} />
                            </a>
                          )}
                          {proj.repoUrl && (
                            <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:underline">
                              Code Repository <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                      {isOwnProfile && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                          <button onClick={() => openProjectModal(proj)} className="p-1.5 text-slate-400 hover:text-rgukt-maroon rounded-lg hover:bg-slate-100"><Edit size={14}/></button>
                          <button onClick={() => handleProjectDelete(proj.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"><Trash size={14}/></button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs italic text-center py-4">No projects listed yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-charcoal flex items-center gap-2 text-lg">
                  <GraduationCap className="text-rgukt-maroon" size={20}/> Education History
                </h3>
                {isOwnProfile && (
                  <button 
                    onClick={() => openEduModal()}
                    className="p-2 bg-slate-50 rounded-xl hover:bg-rgukt-maroon/10 hover:text-rgukt-maroon text-slate-400 transition-all cursor-pointer"
                  >
                    <Plus size={16}/>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map(edu => (
                    <div key={edu.id} className="p-4 border border-slate-50 bg-slate-50/30 rounded-2xl flex justify-between items-start group">
                      <div>
                        <h4 className="font-bold text-charcoal">{edu.institutionName}</h4>
                        <p className="text-xs font-semibold text-slate-500">{edu.degree} in {edu.fieldOfStudy}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Years: {edu.startYear} - {edu.endYear} {edu.grade && `| Grade: ${edu.grade}`}</p>
                      </div>
                      {isOwnProfile && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEduModal(edu)} className="p-1.5 text-slate-400 hover:text-rgukt-maroon rounded-lg hover:bg-slate-100"><Edit size={14}/></button>
                          <button onClick={() => handleEduDelete(edu.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"><Trash size={14}/></button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs italic text-center py-4">No education details added yet.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </>
      )}
    </main>

      <FloatingDock />
      {showBasicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-charcoal">Edit Basic Info</h3>
              <button onClick={() => setShowBasicModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleBasicSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Branch</label>
                  <select 
                    value={basicForm.branch} 
                    onChange={e => setBasicForm({...basicForm, branch: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  >
                    {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'MME'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Batch Year</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2021" 
                    value={basicForm.batch} 
                    onChange={e => setBasicForm({...basicForm, batch: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Mobile Number</label>
                  <input 
                    type="text" 
                    value={basicForm.mobileNumber} 
                    onChange={e => setBasicForm({...basicForm, mobileNumber: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Personal Email</label>
                  <input 
                    type="email" 
                    value={basicForm.personalEmail} 
                    onChange={e => setBasicForm({...basicForm, personalEmail: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Bio / About Me</label>
                <textarea 
                  rows={4}
                  value={basicForm.description} 
                  onChange={e => setBasicForm({...basicForm, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">GitHub URL</label>
                  <input 
                    type="text" 
                    value={basicForm.githubUrl} 
                    onChange={e => setBasicForm({...basicForm, githubUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">LinkedIn URL</label>
                  <input 
                    type="text" 
                    value={basicForm.linkedinUrl} 
                    onChange={e => setBasicForm({...basicForm, linkedinUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Mentored Students Count</label>
                <input 
                  type="number" 
                  value={basicForm.mentoredStudentsCount} 
                  onChange={e => setBasicForm({...basicForm, mentoredStudentsCount: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowBasicModal(false)}
                  className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-rgukt-maroon text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:scale-[1.02] transition-transform"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-charcoal">
                {projectForm.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleProjectSubmit} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Project Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. RGUKT Exam Notification Bot" 
                  value={projectForm.title} 
                  onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Provide a brief explanation of what the project accomplishes." 
                  value={projectForm.description} 
                  onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Live Preview URL</label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={projectForm.projectUrl} 
                  onChange={e => setProjectForm({...projectForm, projectUrl: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">GitHub Repo URL</label>
                <input 
                  type="text" 
                  placeholder="https://github.com/..." 
                  value={projectForm.repoUrl} 
                  onChange={e => setProjectForm({...projectForm, repoUrl: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowProjectModal(false)}
                  className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-rgukt-maroon text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:scale-[1.02] transition-transform"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-charcoal">
                {expForm.id ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button onClick={() => setShowExpModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleExpSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Company Name</label>
                  <input 
                    type="text" 
                    required
                    value={expForm.companyName} 
                    onChange={e => setExpForm({...expForm, companyName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Job Title / Role</label>
                  <input 
                    type="text" 
                    required
                    value={expForm.title} 
                    onChange={e => setExpForm({...expForm, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Employment Type</label>
                  <select 
                    value={expForm.employmentType} 
                    onChange={e => setExpForm({...expForm, employmentType: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  >
                    {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Location Type</label>
                  <select 
                    value={expForm.locationType} 
                    onChange={e => setExpForm({...expForm, locationType: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  >
                    {['On-site', 'Remote', 'Hybrid'].map(lt => (
                      <option key={lt} value={lt}>{lt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Location</label>
                  <input 
                    type="text" 
                    value={expForm.location} 
                    onChange={e => setExpForm({...expForm, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <input 
                    type="checkbox" 
                    id="isCurrent"
                    checked={expForm.isCurrentRole} 
                    onChange={e => setExpForm({...expForm, isCurrentRole: e.target.checked})}
                    className="mr-2 rounded border-slate-300 text-rgukt-maroon focus:ring-rgukt-maroon"
                  />
                  <label htmlFor="isCurrent" className="text-xs font-bold text-slate-600 cursor-pointer">Current Role</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={expForm.startDate} 
                    onChange={e => setExpForm({...expForm, startDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
                {!expForm.isCurrentRole && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">End Date</label>
                    <input 
                      type="date" 
                      required={!expForm.isCurrentRole}
                      value={expForm.endDate} 
                      onChange={e => setExpForm({...expForm, endDate: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Role Description</label>
                <textarea 
                  rows={3}
                  value={expForm.description} 
                  onChange={e => setExpForm({...expForm, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowExpModal(false)}
                  className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-rgukt-maroon text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:scale-[1.02] transition-transform"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showEduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-charcoal">
                {eduForm.id ? 'Edit Education' : 'Add Education'}
              </h3>
              <button onClick={() => setShowEduModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleEduSubmit} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Institution Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rajiv Gandhi University of Knowledge Technologies" 
                  value={eduForm.institutionName} 
                  onChange={e => setEduForm({...eduForm, institutionName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Degree</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. B.Tech" 
                    value={eduForm.degree} 
                    onChange={e => setEduForm({...eduForm, degree: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Field of Study</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Computer Science" 
                    value={eduForm.fieldOfStudy} 
                    onChange={e => setEduForm({...eduForm, fieldOfStudy: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Start Year</label>
                  <input 
                    type="text" 
                    required
                    maxLength={4}
                    placeholder="e.g. 2021" 
                    value={eduForm.startYear} 
                    onChange={e => setEduForm({...eduForm, startYear: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">End Year</label>
                  <input 
                    type="text" 
                    required
                    maxLength={4}
                    placeholder="e.g. 2025" 
                    value={eduForm.endYear} 
                    onChange={e => setEduForm({...eduForm, endYear: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Grade / CGPA</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 8.5" 
                    value={eduForm.grade} 
                    onChange={e => setEduForm({...eduForm, grade: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rgukt-maroon/20 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowEduModal(false)}
                  className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-rgukt-maroon text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:scale-[1.02] transition-transform"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-100/80 animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <UserMinus size={24} />
            </div>
            
            <h3 className="text-base font-bold text-charcoal mb-2">
              {connectionStatus === 'ACCEPTED' ? 'Remove Connection?' : 'Cancel Connection Request?'}
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {connectionStatus === 'ACCEPTED' 
                ? `Are you sure you want to disconnect from ${profile.name}? You will no longer be able to message them directly.` 
                : `Do you want to cancel your connection request to ${profile.name}?`}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrDisconnect}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-xs cursor-pointer shadow-sm shadow-red-100"
              >
                {connectionStatus === 'ACCEPTED' ? 'Disconnect' : 'Cancel Request'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
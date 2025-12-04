import { BodyPartOption, Language, Role } from './types';

export const UITM_LOGO_URL = "https://images.seeklogo.com/logo-png/31/1/uitm-universiti-teknologi-mara-logo-png_seeklogo-313280.png";

// Initial Admin User
export const INITIAL_ADMIN_USER = {
  username: 'nuraiman@uitm.edu.my',
  password: '271787',
  role: Role.ADMIN,
  fullName: 'Nur Aiman (Admin)'
};

// Initial Body Parts Data
export const INITIAL_BODY_PARTS: BodyPartOption[] = [
  { id: '1', category: 'Chest', projection: 'PA' },
  { id: '2', category: 'Chest', projection: 'Lateral' },
  { id: '3', category: 'Abdomen', projection: 'AP Supine' },
  { id: '4', category: 'Abdomen', projection: 'Erect' },
  { id: '5', category: 'Upper Extremities - Hand', projection: 'PA' },
  { id: '6', category: 'Upper Extremities - Hand', projection: 'Oblique' },
  { id: '7', category: 'Upper Extremities - Wrist', projection: 'PA' },
  { id: '8', category: 'Upper Extremities - Wrist', projection: 'Lateral' },
  { id: '9', category: 'Lower Extremities - Knee', projection: 'AP' },
  { id: '10', category: 'Lower Extremities - Knee', projection: 'Lateral' },
];

export const TRANSLATIONS = {
  [Language.MS]: {
    loginTitle: 'Sistem Pengurusan X-Ray UiTM',
    username: 'Nama Pengguna',
    password: 'Kata Laluan',
    loginBtn: 'Log Masuk',
    logout: 'Log Keluar',
    welcome: 'Selamat Datang',
    
    // Roles
    [Role.ADMIN]: 'Pentadbir',
    [Role.DOCTOR]: 'Doktor',
    [Role.RADIOGRAPHER]: 'Juru X-Ray',

    // Dashboard
    newRequest: 'Permohonan Baru',
    myRequests: 'Permohonan Saya',
    pendingRequests: 'Permohonan Menunggu',
    allRequests: 'Semua Permohonan',
    manageUsers: 'Urus Pengguna',
    manageParts: 'Urus Bahagian Badan',
    reports: 'Laporan',

    // Form
    patientName: 'Nama Pesakit',
    icNumber: 'No. Kad Pengenalan',
    uitmId: 'No. UiTM (Jika ada)',
    gender: 'Jantina',
    male: 'Lelaki',
    female: 'Perempuan',
    lmpDate: 'Tarikh LMP',
    history: 'Sejarah Klinikal',
    selectParts: 'Pilih Bahagian & Unjuran',
    getAdvice: 'Dapatkan Nasihat AI',
    submit: 'Hantar Permohonan',
    update: 'Kemaskini Permohonan',
    
    // Status
    status_PENDING: 'Menunggu',
    status_ACCEPTED: 'Diterima',
    status_REJECTED: 'Ditolak',
    status_COMPLETED: 'Selesai',

    // Radiographer Actions
    accept: 'Terima',
    reject: 'Tolak',
    arrivalTime: 'Waktu Tiba',
    startTime: 'Waktu Mula',
    endTime: 'Waktu Tamat',
    finishExam: 'Selesai Pemeriksaan',
    enterDose: 'Masukkan Dos',
    rejectReason: 'Sebab Penolakan',
    
    // Admin
    exportCSV: 'Muat Turun CSV',
    month: 'Bulan',
    year: 'Tahun',
    addUser: 'Tambah Pengguna',
    addPart: 'Tambah Bahagian',
    
    // Common
    cancel: 'Batal',
    save: 'Simpan',
    loading: 'Sedang memproses...',
    noData: 'Tiada data dijumpai.',
    adviceTitle: 'Garis Panduan Pemeriksaan (AI)',
    pleaseSelect: 'Sila pilih...',
  },
  [Language.EN]: {
    loginTitle: 'UiTM X-Ray Management System',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Login',
    logout: 'Logout',
    welcome: 'Welcome',

    // Roles
    [Role.ADMIN]: 'Admin',
    [Role.DOCTOR]: 'Doctor',
    [Role.RADIOGRAPHER]: 'Radiographer',

    // Dashboard
    newRequest: 'New Request',
    myRequests: 'My Requests',
    pendingRequests: 'Pending Requests',
    allRequests: 'All Requests',
    manageUsers: 'Manage Users',
    manageParts: 'Manage Body Parts',
    reports: 'Reports',

    // Form
    patientName: 'Patient Name',
    icNumber: 'IC Number',
    uitmId: 'UiTM ID (Optional)',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    lmpDate: 'LMP Date',
    history: 'Clinical History',
    selectParts: 'Select Parts & Projection',
    getAdvice: 'Get AI Advice',
    submit: 'Submit Request',
    update: 'Update Request',

    // Status
    status_PENDING: 'Pending',
    status_ACCEPTED: 'Accepted',
    status_REJECTED: 'Rejected',
    status_COMPLETED: 'Completed',

    // Radiographer Actions
    accept: 'Accept',
    reject: 'Reject',
    arrivalTime: 'Arrival Time',
    startTime: 'Start Time',
    endTime: 'End Time',
    finishExam: 'Finish Exam',
    enterDose: 'Enter Dose',
    rejectReason: 'Rejection Reason',

    // Admin
    exportCSV: 'Download CSV',
    month: 'Month',
    year: 'Year',
    addUser: 'Add User',
    addPart: 'Add Part',

    // Common
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    noData: 'No data found.',
    adviceTitle: 'Examination Guidelines (AI)',
    pleaseSelect: 'Please select...',
  }
};
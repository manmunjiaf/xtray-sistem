import { INITIAL_ADMIN_USER, INITIAL_BODY_PARTS } from "../constants";
import { BodyPartOption, RequestStatus, Role, User, XRayRequest } from "../types";

const KEYS = {
  USERS: 'uitm_xray_users',
  REQUESTS: 'uitm_xray_requests',
  PARTS: 'uitm_xray_parts',
};

// --- Initialization ---

export const initDB = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify([INITIAL_ADMIN_USER]));
  }
  if (!localStorage.getItem(KEYS.PARTS)) {
    localStorage.setItem(KEYS.PARTS, JSON.stringify(INITIAL_BODY_PARTS));
  }
  if (!localStorage.getItem(KEYS.REQUESTS)) {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify([]));
  }
};

// --- Users ---

export const getUsers = (): User[] => {
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const addUser = (user: User) => {
  const users = getUsers();
  if (users.find(u => u.username === user.username)) {
    throw new Error("Username already exists");
  }
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const verifyUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

// --- Parts ---

export const getParts = (): BodyPartOption[] => {
  const data = localStorage.getItem(KEYS.PARTS);
  return data ? JSON.parse(data) : [];
};

export const saveParts = (parts: BodyPartOption[]) => {
  localStorage.setItem(KEYS.PARTS, JSON.stringify(parts));
};

// --- Requests ---

export const getRequests = (): XRayRequest[] => {
  const data = localStorage.getItem(KEYS.REQUESTS);
  return data ? JSON.parse(data) : [];
};

export const saveRequest = (req: XRayRequest) => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === req.id);
  if (index >= 0) {
    requests[index] = req;
  } else {
    requests.push(req);
  }
  localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
};

export const updateRequestStatus = (id: string, updates: Partial<XRayRequest>) => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index >= 0) {
    requests[index] = { ...requests[index], ...updates };
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
  }
};
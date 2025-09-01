export const API_BASE = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Feature flags (build-time via CRA envs)
export const SHOW_CREATE_BUTTON = (process.env.REACT_APP_SHOW_CREATE_BUTTON || 'false') === 'true';
export const SHOW_FORM_ACTIONS = (process.env.REACT_APP_SHOW_FORM_ACTIONS || 'false') === 'true';

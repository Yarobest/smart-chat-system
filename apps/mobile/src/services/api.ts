import { authStore } from '@/src/stores/authStore';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 4001;

const getHostFromUri = (uri?: string | null) => {
  if (!uri) return null;

  return uri
    .replace(/^[a-z]+:\/\//i, '')
    .split('/')[0]
    .split(':')[0] || null;
};

const getDefaultApiUrl = () => {
  if (Platform.OS === 'web') {
    return `http://localhost:${API_PORT}`;
  }

  const host =
    getHostFromUri(Constants.expoConfig?.hostUri) ??
    getHostFromUri(Constants.manifest2?.extra?.expoClient?.hostUri) ??
    getHostFromUri(Constants.linkingUri) ??
    getHostFromUri(Constants.debuggerHost);

  if (host) {
    return `http://${host}:${API_PORT}`;
  }

  return Platform.OS === 'android'
    ? `http://10.0.2.2:${API_PORT}`
    : `http://localhost:${API_PORT}`;
};

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? getDefaultApiUrl();

if (__DEV__) {
  console.log(`Mobile API URL: ${API_URL}`);
}

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function api<T>(path: string, options: ApiOptions = {}) {
  const headers = new Headers(options.headers);

  if (!headers.has('content-type') && options.body && !(options.body instanceof FormData)) {
    headers.set('content-type', 'application/json');
  }

  if (options.auth !== false && authStore.session?.token) {
    headers.set('authorization', `Bearer ${authStore.session.token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(`Network request failed. Check that the API is reachable at ${API_URL}`);
  }
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof data?.message === 'string'
        ? data.message
        : Array.isArray(data?.message)
          ? data.message.join('\n')
          : 'Request failed';

    throw new Error(message);
  }

  return data as T;
}

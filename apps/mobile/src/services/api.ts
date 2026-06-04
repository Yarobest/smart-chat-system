import { authStore } from '@/src/stores/authStore';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDefaultApiUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:4001';
  }

  const expoHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoClient?.hostUri;
  const host = expoHost?.split(':')[0];

  if (host) {
    return `http://${host}:4001`;
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:4001'
    : 'http://localhost:4001';
};

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? getDefaultApiUrl();

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function api<T>(path: string, options: ApiOptions = {}) {
  const headers = new Headers(options.headers);

  if (!headers.has('content-type') && options.body) {
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

import * as AuthSession from 'expo-auth-session';
import * as SecureStore  from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';

const issuer   = 'http://192.168.0.108:8788/realms/scat6-app';
const clientId = 'mobile-app';
const scheme   = 'scat6-app';
const discoveryPromise = AuthSession.fetchDiscoveryAsync(issuer);

const KEY_ACCESS  = 'accessToken';
const KEY_REFRESH = 'refreshToken';
const KEY_EXPIRE  = 'expireAt';

export async function getUserFullName(): Promise<string | null> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error('No access token');
  try {
    const { name } = jwtDecode<{ name?: string }>(accessToken);
    return name ?? null;
  } catch (err) {
    console.error('jwt-decode error:', err);
    return null;
  }
}

export async function isLoggedIn(): Promise<boolean> {
  const accessToken = await getValidAccessToken();
  return accessToken !== null;
}

async function storeTokenResponse(res: AuthSession.TokenResponse) {
  const expireAt = Date.now() + (res.expiresIn ?? 3600) * 1000;
  console.log('access token', res.accessToken);
  await SecureStore.setItemAsync(KEY_ACCESS,  res.accessToken);
  if (!res.refreshToken) throw new Error('Refresh token is required');
  await SecureStore.setItemAsync(KEY_REFRESH, res.refreshToken);
  await SecureStore.setItemAsync(KEY_EXPIRE,  String(expireAt));
}

export async function getValidAccessToken(): Promise<string | null> {
  const [access, refresh, expireStr] = await Promise.all([
    SecureStore.getItemAsync(KEY_ACCESS),
    SecureStore.getItemAsync(KEY_REFRESH),
    SecureStore.getItemAsync(KEY_EXPIRE),
  ]);

  if (!access || !refresh || !expireStr) return null;
  const expireAt = Number(expireStr);

  // если осталось более минуты – ок
  if (Date.now() < expireAt - 60_000) {
    return access;
  }

  // иначе обновляем
  try {
    const newRes = await AuthSession.refreshAsync(
      { clientId, refreshToken: refresh },
      await discoveryPromise
    );
    await storeTokenResponse(newRes);
    return newRes.accessToken;
  } catch {
    // не удалось – чистим
    await SecureStore.deleteItemAsync(KEY_ACCESS);
    await SecureStore.deleteItemAsync(KEY_REFRESH);
    await SecureStore.deleteItemAsync(KEY_EXPIRE);
    return null;
  }
}

export async function signInAsync(): Promise<boolean> {
  const redirectUri = AuthSession.makeRedirectUri({ scheme });
  console.log('redirectUri', redirectUri);
  const authRequest = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true,
    extraParams: {
      prompt: 'login',
    },
  });
  const discovery = await discoveryPromise;
  console.log('discovery', discovery);
  await authRequest.makeAuthUrlAsync(discovery);
  console.log('authRequest', authRequest);
  const result = await authRequest.promptAsync(discovery);
  if (result.type !== 'success') return false;

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId,
      code: result.params.code,
      redirectUri,
      extraParams: { code_verifier: authRequest.codeVerifier! },
    },
    discovery
  );

  await storeTokenResponse(tokenResponse);
  return true;
}

export async function logoutAsync() {
  await Promise.all([
    SecureStore.deleteItemAsync(KEY_ACCESS),
    SecureStore.deleteItemAsync(KEY_REFRESH),
    SecureStore.deleteItemAsync(KEY_EXPIRE),
  ]);
}

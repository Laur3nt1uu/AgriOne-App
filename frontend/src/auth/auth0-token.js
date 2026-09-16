let getAccessTokenFn = null;

export function setTokenGetter(fn) {
  getAccessTokenFn = fn;
}

export async function getAuth0Token() {
  if (!getAccessTokenFn) return null;
  try {
    return await getAccessTokenFn();
  } catch {
    return null;
  }
}

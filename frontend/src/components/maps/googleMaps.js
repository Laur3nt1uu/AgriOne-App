import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let loaderPromise = null;

export function loadGoogleMaps() {
  if (loaderPromise) return loaderPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    loaderPromise = Promise.reject(
      new Error("Missing VITE_GOOGLE_MAPS_API_KEY. Add it to frontend/.env")
    );
    return loaderPromise;
  }

  loaderPromise = (async () => {
    // NOTE: the functional API expects query params like `key` and `v`.
    // Passing `apiKey` can result in `api_key` which Google does not accept.
    setOptions({ key: apiKey, v: "weekly" });

    await importLibrary("maps");
    await importLibrary("drawing");
    await importLibrary("geometry");

    if (!window.google?.maps) {
      throw new Error("Google Maps failed to initialize.");
    }

    return window.google;
  })();
  return loaderPromise;
}

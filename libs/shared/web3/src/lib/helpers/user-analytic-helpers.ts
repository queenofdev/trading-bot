import { EnvHelper } from "./environment";

interface ISegmentData {
  address: string;
  value?: string;
  type: string | null;
  bondName?: string;
  approved: boolean;
  txHash: string | null;
  country?: string;
}

/**
 * Obtain country from IP address
 * @returns the country name or an empty string
 */
async function countryLookup() {
  // Determine the country the user is from, based on IP
  // Geoapify offers 3000 lookups/day, so we should be fine
  const apiKey = EnvHelper.getGeoapifyAPIKey();

  if (!apiKey) return "";

  const response = await fetch("https://api.geoapify.com/v1/ipinfo?apiKey=" + apiKey, {
    method: "GET",
  });

  if (!response.ok) {
    console.error("Unable to determine country from IP lookup: " + response.body);
    return "";
  }

  const json = await response.json();
  return json.country.name;
}

// Pushing data to segment analytics
export function segmentUA(data: ISegmentData) {
  const thisWindow = window as any;
  // eslint-disable-next-line no-self-assign
  const analytics = (thisWindow.analytics = thisWindow.analytics);
  countryLookup().then((country) => (data.country = country));

  // NOTE (appleseed): the analytics object may not exist (if there is no SEGMENT_API_KEY)
  // Passing in combined data directly so as not to have a nested object
  try {
    analytics.track(data.type, data, { context: { ip: "0.0.0.0" } });
  } catch (e) {
    console.log("segmentAnalytics", e);
  }
}

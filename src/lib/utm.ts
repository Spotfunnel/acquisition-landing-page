/**
 * Extracts standard UTM parameters and ad-click IDs from the current URL 
 * and stores them in sessionStorage so they persist across page views.
 * 
 * Returns a clean object containing exactly the tracking params we need.
 */

export interface TrackingData {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
    fbclid: string;
    page_url: string;
}

export function extractAndStoreTrackingData(): TrackingData {
    if (typeof window === 'undefined') {
        return {
            utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '',
            utm_term: '', fbclid: '', page_url: ''
        };
    }

    const urlParams = new URLSearchParams(window.location.search);

    // List of parameters we care about
    const paramsToTrack = [
        'utm_source', 'utm_medium', 'utm_campaign',
        'utm_content', 'utm_term', 'fbclid'
    ];

    // 1. Grab from URL if present, and save to SessionStorage to persist across funnel steps
    paramsToTrack.forEach(param => {
        const value = urlParams.get(param);
        if (value) {
            sessionStorage.setItem(param, value);
        }
    });

    // 2. Read back from SessionStorage (so even if they navigate around, we keep their origin)
    const getStoredParam = (param: string) => sessionStorage.getItem(param) || '';

    return {
        utm_source: getStoredParam('utm_source'),
        utm_medium: getStoredParam('utm_medium'),
        utm_campaign: getStoredParam('utm_campaign'),
        utm_content: getStoredParam('utm_content'),
        utm_term: getStoredParam('utm_term'),
        fbclid: getStoredParam('fbclid'),
        page_url: window.location.href.split('?')[0] // The clean URL without parameters
    };
}

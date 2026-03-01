/**
 * Type-safe interface to the global Facebook Pixel function (`fbq`).
 * This ensures the SPA doesn't crash if the pixel is blocked by an adblocker.
 */

// Extend window object to recognize the fbq function injected by our index.html snippet
declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
    }
}

/**
 * Fires a standard Meta Pixel micro-event.
 * CRITICAL: Under the Serverless Tracking Architecture, NEVER fire 'Lead' here.
 * Only fire 'PageView', 'ViewContent', 'Contact', or custom events.
 */
export function fireMetaPixelEvent(eventName: string, parameters?: Record<string, any>) {
    try {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
            // Failsafe: Prevent 'Lead' event from sneaking into the client-side
            if (eventName.toLowerCase() === 'lead') {
                console.warn("Blocked client-side 'Lead' event. Leads must fire from the Vercel backend to prevent duplicates.");
                return;
            }

            if (parameters) {
                window.fbq('track', eventName, parameters);
            } else {
                window.fbq('track', eventName);
            }

            console.log(`[Meta Pixel] Fired ${eventName}`, parameters || '');
        }
    } catch (err) {
        // Fail silently in production to avoid disruption if scripts are blocked
        console.error(`[Meta Pixel Error] Failed to fire ${eventName}:`, err);
    }
}

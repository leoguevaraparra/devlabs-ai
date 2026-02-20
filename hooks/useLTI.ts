import { useState, useEffect } from 'react';
import { LtiLaunchData, MoodleState } from '../types';
import { jwtDecode } from "jwt-decode";
import { INITIAL_MOODLE_STATE } from '../constants';

/**
 * Custom hook to manage LTI 1.3 Launch flow and Moodle Session state.
 * 
 * Handles:
 * 1. Extraction of LTIK (LTI Token) from URL or Storage.
 * 2. Session persistence via sessionStorage (to survive reloads in iframes).
 * 3. Token decoding and validation.
 * 4. State management for the Moodle connection.
 */
export const useLTI = () => {
    const [ltiFlow, setLtiFlow] = useState<'IDLE' | 'REGISTRATION' | 'LOGIN' | 'LAUNCH' | 'ERROR'>('IDLE');
    const [ltiMessage, setLtiMessage] = useState<string>('');
    const [moodleState, setMoodleState] = useState<MoodleState>(INITIAL_MOODLE_STATE);

    useEffect(() => {
        /**
         * Core initialization logic.
         * Runs once on mount to determine the current LTI state.
         */
        const initializeLTI = async () => {
            // Force relative path to use Netlify Proxy if VITE_API_URL is effectively the same domain or empty
            // Otherwise, respect the env var (but risk CORS).
            // Recommendation: In Netlify, leave VITE_API_URL empty/undefined to use the proxy rule.
            const API_URL = import.meta.env.VITE_API_URL || '';

            // 1. Token Discovery Strategy
            // Search in Query String (standard), Hash (some routers), or Session Storage (reloads)
            const params = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');

            let ltik = params.get('ltik') || hashParams.get('ltik');

            if (ltik) {
                console.log("[LTI] New LTIK found. Initializing validation...");
                setLtiFlow('LAUNCH'); // Show loading screen
                setLtiMessage('Validando credenciales LTI...');

                sessionStorage.setItem('ltik', ltik);

                const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
            } else {
                ltik = sessionStorage.getItem('ltik');
                if (ltik) {
                    console.log("[LTI] LTIK restored from storage.");
                    setLtiFlow('LAUNCH'); // Show loading screen
                    setLtiMessage('Restaurando sesión...');
                }
            }

            // 2. OIDC/Launch Handling (Initial Handshake)
            if (params.has('iss') && params.has('login_hint')) {
                setLtiFlow('LOGIN');
                setLtiMessage('Iniciando sesión OIDC...');
                return;
            }

            // 3. Backend Session Validation
            if (ltik) {
                await validateBackendSession(API_URL, ltik);
            } else {
                // No token found - check if we are in a purely client-side launch (id_token)
                // or if we should fallback to Dev Mode.
                handleClientSideLaunch(params);
            }
        };

        initializeLTI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Validates the LTI session with the backend using the discovered LTIK.
     * Use explicit LTIK passing to bypass 3rd-party cookie blocks.
     */
    const validateBackendSession = async (apiUrl: string, ltik: string) => {
        try {
            // Logic to use Proxy if apiUrl is absolute but we want relative
            // For now, adhere to env var. 
            // If user unsets VITE_API_URL in Netlify, apiUrl becomes '', creating relative '/api/me' request.

            // Added ?ltik= query parameter. Proxies sometimes strip Authorization headers,
            // but they never strip query parameters. This guarantees the backend gets the session.
            const res = await fetch(`${apiUrl}/api/me?ltik=${ltik}`, {
                headers: {
                    'Authorization': `Bearer ${ltik}`,
                    'LTIK': ltik
                }
            });

            if (res.ok) {
                const data = await res.json();
                console.log("[LTI] Session Authorized:", data.userId);

                setMoodleState({
                    isConnected: true,
                    ltiData: {
                        userId: data.userId,
                        roles: Array.isArray(data.roles) ? data.roles.join(', ') : data.roles,
                        contextId: data.context?.id || 'Unknown',
                        contextLabel: data.context?.label || 'Moodle Course',
                        ltik: ltik
                    },
                    lastGradeSent: null,
                    lastGradeTime: null
                });
                setLtiFlow('IDLE'); // Ready
            } else {
                console.warn("[LTI] Token rejected by backend.", res.status);
                sessionStorage.removeItem('ltik');
                // DEBUG INFO FOR USER
                const urlDebug = apiUrl ? apiUrl : '/api (Proxy)';
                setLtiMessage(`Error ${res.status}: Token rechazado al conectar con ${urlDebug}.`);
                setLtiFlow('ERROR'); // Stay in Error state specifically
            }
        } catch (err) {
            console.error("[LTI] Network error:", err);
            setLtiMessage(`Error de red: ${err instanceof Error ? err.message : String(err)}`);
            setLtiFlow('ERROR');
        }
    };

    /**
     * Handles client-side LTI 1.3 Launch (id_token parsing)
     * Used primarily for demos or when backend is not strictly enforcing session yet.
     */
    const handleClientSideLaunch = (params: URLSearchParams) => {
        if (params.has('id_token')) {
            setLtiFlow('LAUNCH');
            setLtiMessage('Procesando LTI 1.3 Launch...');

            const idToken = params.get('id_token');
            if (!idToken) return;

            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const decoded: any = jwtDecode(idToken);
                console.log("[LTI] Decoded ID Token:", decoded);

                const ltiData: LtiLaunchData = {
                    userId: decoded.sub || 'Unknown',
                    roles: decoded['https://purl.imsglobal.org/spec/lti/claim/roles']?.[0] || 'Learner',
                    contextId: decoded['https://purl.imsglobal.org/spec/lti/claim/context']?.id || 'Unknown',
                    contextLabel: decoded['https://purl.imsglobal.org/spec/lti/claim/context']?.label || 'Moodle Course',
                    ltik: undefined // No LTIK in this flow
                };

                setMoodleState({
                    isConnected: true,
                    ltiData: ltiData,
                    lastGradeSent: null,
                    lastGradeTime: null
                });
                setLtiFlow('IDLE');
            } catch (error) {
                console.error("[LTI] Token Decode Error:", error);
                setLtiFlow('ERROR');
                setLtiMessage('Error procesando el token LTI.');
            }
        }
    };

    return { ltiFlow, ltiMessage, moodleState, setMoodleState };
};

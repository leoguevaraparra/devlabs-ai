import { useState, useEffect } from 'react';
import { LtiLaunchData, MoodleState } from '../types';
import { jwtDecode } from "jwt-decode";

export const useLTI = () => {
    const [ltiFlow, setLtiFlow] = useState<'IDLE' | 'REGISTRATION' | 'LOGIN' | 'LAUNCH' | 'ERROR'>('IDLE');
    const [ltiMessage, setLtiMessage] = useState<string>('');
    const [moodleState, setMoodleState] = useState<MoodleState>({
        isConnected: false,
        ltiData: null,
        lastGradeSent: null,
        lastGradeTime: null
    });

    // Check for active backend session
    useEffect(() => {
        const checkBackendSession = async () => {
            const API_URL = import.meta.env.VITE_API_URL || '';

            // Capture LTIK from URL (passed by Backend redirect)
            const params = new URLSearchParams(window.location.search);
            const ltik = params.get('ltik');

            try {
                const headers: HeadersInit = {};
                // Send LTIK in Header (Backup)
                if (ltik) {
                    headers['Authorization'] = `Bearer ${ltik}`;
                    headers['LTIK'] = ltik; // Try custom header too
                }

                // IMPORTANT: Send credentials AND ltik in Query String (Primary)
                const fetchUrl = ltik ? `${API_URL}/api/me?ltik=${ltik}` : `${API_URL}/api/me`;

                console.log(`[LTI] Fetching session from: ${fetchUrl}`);

                const res = await fetch(fetchUrl, {
                    headers,
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    setMoodleState({
                        isConnected: true,
                        ltiData: {
                            userId: data.userId,
                            roles: data.roles.join(', '),
                            contextId: data.context.id,
                            contextLabel: data.context.label || 'Moodle Course',
                            outcomeServiceUrl: '', // Backend handles this
                            resultSourcedId: '',
                            ltik: ltik || undefined // Store LTIK for future requests
                        },
                        lastGradeSent: null,
                        lastGradeTime: null
                    });
                    setLtiFlow('IDLE');

                    // Clean URL (optional but nice)
                    if (ltik) {
                        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
                    }
                }
            } catch (err) {
                console.log("[LTI] No valid backend session found. Switching to Dev/Simulation Mode.");
                // Fallback for Dev/Testing without active Backend
                setMoodleState({
                    isConnected: true,
                    ltiData: {
                        userId: 'Dev_User',
                        roles: 'Instructor',
                        contextId: 'dev_env',
                        contextLabel: 'Modo Pruebas (Sin Backend)',
                        outcomeServiceUrl: '',
                        resultSourcedId: ''
                    },
                    lastGradeSent: null,
                    lastGradeTime: null
                });
                setLtiFlow('IDLE');
            }
        };
        // Only check if we are not already in a launch flow (basic check)
        checkBackendSession();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search || window.location.hash.replace('#', '?'));

        // 1. OIDC Initiation (Login)
        if (params.has('iss') && params.has('login_hint')) {
            setLtiFlow('LOGIN');
            setLtiMessage('Validando sesión OIDC con Moodle...');
            // In a real app, we would redirect to the platform's auth endpoint here.
            // For this client-side demo, we simulate a successful redirect back with a token.
            setTimeout(() => {
                setLtiFlow('IDLE'); // Reset to IDLE or proceed to launch simulation
                console.log("[LTI] OIDC Login initiated. Redirecting to auth endpoint (simulated).");
            }, 1000);
            return;
        }

        // 2. LTI Launch (id_token present)
        if (params.has('id_token')) {
            setLtiFlow('LAUNCH');
            setLtiMessage('Procesando LTI 1.3 Launch...');
            const idToken = params.get('id_token');

            if (idToken) {
                try {
                    const decoded: any = jwtDecode(idToken);
                    console.log("[LTI] Decoded Token:", decoded);

                    // LTI 1.3 Claims Map
                    // https://purl.imsglobal.org/spec/lti/claim/resource_link
                    // https://purl.imsglobal.org/spec/lti/claim/context
                    // https://purl.imsglobal.org/spec/lti/claim/roles
                    // https://purl.imsglobal.org/spec/lti-ags/claim/endpoint

                    const errors = [];
                    // Basic Validation
                    if (decoded.iss !== 'https://moodle.riwi.io' && !decoded.iss.includes('http')) errors.push('Invalid Issuer');
                    if (!decoded.sub) errors.push('Missing Subject (User ID)');

                    const ltiData: LtiLaunchData = {
                        userId: decoded.sub || 'Unknown_User',
                        roles: decoded['https://purl.imsglobal.org/spec/lti/claim/roles']?.[0] || 'Learner',
                        contextId: decoded['https://purl.imsglobal.org/spec/lti/claim/context']?.id || 'Unknown_Course',
                        contextLabel: decoded['https://purl.imsglobal.org/spec/lti/claim/context']?.label || 'Curso Sin Nombre',
                        outcomeServiceUrl: decoded['https://purl.imsglobal.org/spec/lti-ags/claim/endpoint']?.lineitem || '',
                        resultSourcedId: decoded.sub // Using sub as generic identifier for grade sync in this demo
                    };

                    setMoodleState({
                        isConnected: true,
                        ltiData: ltiData,
                        lastGradeSent: null,
                        lastGradeTime: null
                    });
                    setLtiFlow('IDLE');

                } catch (error) {
                    console.error("[LTI] Token Error:", error);
                    setLtiFlow('ERROR');
                    setLtiMessage('Error decodificando LTI Token. Verifica la consola.');
                }
            }
            return;
        }

        // 3. Default Dev/Standalone Mode
        if (!moodleState.isConnected && !params.has('id_token') && !params.has('iss')) {
            // Optional: Auto-connect as "Dev User" if not in production
            /*
           setMoodleState({
               isConnected: true,
               ltiData: {
                   userId: 'Dev_User',
                   roles: 'Instructor',
                   contextId: 'dev_env',
                   contextLabel: 'Ambiente de Desarrollo',
               },
               lastGradeSent: null,
               lastGradeTime: null
           });
           */
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { ltiFlow, ltiMessage, moodleState, setMoodleState };
};

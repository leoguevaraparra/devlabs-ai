import { LtiLaunchData, EvaluationResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Sends a grade to Moodle via the backend using the LTI 1.3 Assignment and Grade Service (AGS).
 * 
 * @param ltiData - Context data containing the user ID, LTI keys, and endpoint.
 * @param evaluation - The result of the code evaluation (score and feedback).
 * @returns boolean indicating success or failure.
 */
export const submitLtiGrade = async (ltiData: LtiLaunchData | null, evaluation: EvaluationResult): Promise<boolean> => {
  console.group('[Moodle Service] Submitting Grade');

  if (!ltiData) {
    console.warn('❌ No active LTI session found. Cannot sync grade.');
    console.groupEnd();
    return false;
  }

  if (!ltiData.userId || ltiData.userId === 'Dev_User') {
    console.info('⚠️ Development mode or invalid user. Skipping grade sync.');
    console.groupEnd();
    // Return true to simulate success in dev mode
    return true;
  }

  try {
    const payload = {
      userId: ltiData.userId,
      grade: evaluation.score,
      comment: evaluation.feedback || 'Evaluación automática completada.',
      // Pass LTIK if available to authenticate the request
      ltik: ltiData.ltik
    };

    console.log('📤 Sending payload:', payload);

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add LTIK to Headers if available
    if (ltiData.ltik) {
      headers['Authorization'] = `Bearer ${ltiData.ltik}`;
      headers['LTIK'] = ltiData.ltik;
    }

    const fetchUrl = ltiData.ltik ? `${API_URL}/api/grade?ltik=${ltiData.ltik}` : `${API_URL}/api/grade`;

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Grade synced successfully:', result);
    console.groupEnd();
    return true;

  } catch (error) {
    console.error('❌ Error syncing grade:', error);
    console.groupEnd();
    return false;
  }
};
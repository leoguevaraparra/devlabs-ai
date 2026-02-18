import { LtiLaunchData } from "../types";

// Simula el envío de una calificación a Moodle usando el protocolo LTI
export const submitLtiGrade = async (
  ltiData: LtiLaunchData,
  score: number
): Promise<{ success: boolean; xmlLog: string }> => {
  // En LTI, las notas se envían como un valor decimal entre 0.0 y 1.0
  const normalizedScore = score / 100;

  // Send grade to local backend middleware which handles LTI signing
  // Use VITE_API_URL if defined, otherwise relative path (for proxy/same-origin)
  const API_URL = import.meta.env.VITE_API_URL || '';

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // if (ltiData.ltik) {
    //   headers['Authorization'] = `Bearer ${ltiData.ltik}`;
    // }

    const fetchUrl = ltiData.ltik ? `${API_URL}/api/grade?ltik=${ltiData.ltik}` : `${API_URL}/api/grade`;

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: headers,
      // IMPORTANT: Send cookies (session) to backend
      credentials: 'include',
      body: JSON.stringify({
        score: score,
        ltiData: ltiData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit grade to backend');
    }

    console.log("%c[Moodle LTI] Calificación enviada al Backend con éxito.", "color: #2ecc71");
    return {
      success: true,
      xmlLog: "Sent to /api/grade (Backend handles AGS)"
    };

  } catch (error) {
    console.warn("[Moodle LTI] Backend no disponible o error en envío. Simulando éxito en consola.", error);

    // Fallback Simulation (for testing without backend)
    const agsPayload = {
      timestamp: new Date().toISOString(),
      scoreGiven: score / 100,
      activityProgress: "Completed",
      gradingProgress: "FullyGraded",
      userId: ltiData.userId,
      note: "Fallback Simulation (No Backend)"
    };
    console.log("Fallback Payload:", agsPayload);

    return {
      success: true,
      xmlLog: "Simulation: Backend Unreachable. Payload logged to console."
    };
  }
};
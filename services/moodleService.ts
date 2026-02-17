import { LtiLaunchData } from "../types";

// Simula el envío de una calificación a Moodle usando el protocolo LTI
export const submitLtiGrade = async (
  ltiData: LtiLaunchData,
  score: number
): Promise<{ success: boolean; xmlLog: string }> => {
  // En LTI, las notas se envían como un valor decimal entre 0.0 y 1.0
  const normalizedScore = score / 100;

  // Send grade to local backend middleware which handles LTI signing
  try {
    const response = await fetch('/api/grade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: score, // Backend converts this to 0.0-1.0
        ltiData: ltiData // Optional: Pass context if backend is stateless (though ltijs uses cookies)
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
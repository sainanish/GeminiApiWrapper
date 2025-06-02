import { CredentialingRequest, EvaluationResult } from "@shared/schema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `
You are a credentialing compliance assistant for a U.S.-based medical insurance company. You are reviewing multiple documents uploaded by a doctor to evaluate whether they meet credentialing requirements.

Each document contains unstructured text. You must extract required fields and check for completeness, consistency, validity, and expiration.

### Credentialing Rules:

1. Resume:
- Must include: full name, contact info, degrees (MBBS, MD, etc.), institute names, graduation years, specialties, internships/residencies, work history (hospital, role, dates), board memberships, clinical skills, CME (courses/trainings).
- Flag: missing dates, career gaps, no board certs, no hospital affiliations, lack of CME, vague or sloppy formatting.

2. Medical License:
- Must include: license number, issuing authority (state/NMC/MCI), expiry date (must be valid), active status, correct jurisdiction.
- Flag: expired, suspended, fake, inconsistent name.

3. DEA ID Card:
- Must include: DEA number, doctor's name & address, expiry date, drug schedule.
- Flag: expired, unverified, name/address mismatch.

4. Malpractice Insurance:
- Must include: doctor name match, effective + expiry dates, ≥ $1M/$3M coverage, insurer name, specialty match.
- Flag: low/lapsed coverage, missing details, undisclosed claims.

5. Board Certification:
- Must include: board name (e.g., ABMS), specialty, valid date.
- Flag: expired cert, wrong board, missing board cert for claimed field.

6. CAQH Attestation:
- Must include: updated within 120 days, includes license info, insurance, work history, references.
- Flag: outdated, incomplete, inconsistent with resume/license.

7. W-9 Form:
- Must include: doctor/practice name, address, TIN/SSN/EIN, signature + date, recent tax year.
- Flag: missing or invalid TIN, unsigned, outdated.

---

### Output Format:
Return a JSON like this:

{
  "doctor_name": "Extracted full name or 'Unknown'",
  "result": "Pass" or "Fail",
  "issues": ["List of all problems"],
  "next_steps": ["Instructions to fix each issue"]
}
`;

export async function callGeminiAPI(combinedDocuments: string): Promise<EvaluationResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured. Please check your environment variables.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const headers = {
    "Content-Type": "application/json"
  };

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: SYSTEM_PROMPT + "\n\nDocuments:\n" + combinedDocuments
          }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const evaluationText = result.candidates[0].content.parts[0].text;
  
  try {
    // Clean the response text to extract JSON
    const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsedResult = JSON.parse(jsonMatch[0]);
    return parsedResult as EvaluationResult;
  } catch (parseError) {
    console.error("Failed to parse Gemini response:", evaluationText);
    throw new Error("Invalid response format from AI service");
  }
}

export function combineDocuments(request: CredentialingRequest): string {
  return `
Resume:
${request.resume}

Medical License:
${request.medical_license}

DEA ID:
${request.dea_id}

Malpractice Insurance:
${request.malpractice_insurance}

Board Certification:
${request.board_certification}

CAQH Attestation:
${request.caqh_attestation}

W-9 Form:
${request.w9}
`;
}

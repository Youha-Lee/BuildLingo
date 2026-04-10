import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDeepExplanation(term: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `건설/BIM 전문 용어인 "${term}"에 대해 다음 관점에서 심층 분석해줘:
1. 최신 기술 트렌드 (Digital Twin, AI, Automation 등과 연계)
2. 실제 프로젝트 적용 시 주의사항 및 팁
3. 향후 5년 내 변화 전망

답변은 한국어로, 전문적이면서도 이해하기 쉽게 작성해줘.`,
    });

    return response.text || "설명을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 설명을 생성하는 중 오류가 발생했습니다. API 키 설정을 확인해주세요.";
  }
}

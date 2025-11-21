import { GoogleGenAI } from "@google/genai";
import { INVESTORS } from "../constants";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

interface GenerateAnalysisParams {
  stockName: string;
  selectedInvestorIds: string[];
}

export const generateStockAnalysis = async ({ stockName, selectedInvestorIds }: GenerateAnalysisParams) => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const selectedInvestors = INVESTORS.filter(inv => selectedInvestorIds.includes(inv.id));
  const investorNames = selectedInvestors.map(inv => inv.name).join("、");
  
  // Specialized prompt for China/HK stocks
  const prompt = `
    作为一个专业的金融分析师，请对中国或香港上市的公司 "${stockName}" 进行深度基本面分析。
    
    请特别结合以下投资大师的投资哲学进行分析：${investorNames}。
    
    报告结构如下：
    1. **公司概况与最新动态**：利用Google搜索工具获取最新的股价、市盈率(PE/TTM)、市值、最近的财报摘要以及重大新闻。
    2. **大师视角分析**：
       ${selectedInvestors.map(inv => `- **${inv.name}视角**：根据${inv.description}，分析该公司是否符合其选股标准。列出具体的财务指标支持你的观点。`).join('\n       ')}
    3. **综合评级与风险提示**：综合上述观点，给出优势、劣势、机会与风险（SWOT）分析。
    4. **总结**：用一句话总结目前的投资吸引力。

    请确保数据实时且准确，货币单位请根据上市地点使用人民币(CNY)或港币(HKD)。使用Markdown格式输出。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "你是一位精通中国A股和港股市场的资深基金经理，擅长价值投资和基本面分析。你的回答必须客观、数据驱动，并引用真实来源。",
      }
    });

    // Extract text
    const text = response.text;
    
    // Extract sources from grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
      ?.filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title
      })) || [];

    // Deduplicate sources
    const uniqueSources = Array.from(new Map(sources.map((s: any) => [s.uri, s])).values());

    return {
      text,
      sources: uniqueSources as Array<{ uri: string; title: string }>
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
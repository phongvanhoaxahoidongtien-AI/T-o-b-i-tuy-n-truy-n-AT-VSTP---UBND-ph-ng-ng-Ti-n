import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type, Modality } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Generate Content
app.post("/api/generate-content", async (req, res) => {
  try {
    const {
      topic,
      postType,
      tone,
      targetAudience,
      length,
      includeHashtags,
      includeHotline,
      customNotes,
      wardName = "UBND Phường",
      newsReference,
      learnedStyleRules,
      sampleEdits,
    } = req.body;

    const ai = getGeminiClient();

    let systemInstruction = `Bạn là Chuyên viên Truyền thông & Cán bộ Văn hóa Thông tin cấp Phường chuyên trách công tác An toàn vệ sinh thực phẩm (ATVSTP) cho ${wardName}.
Nhiệm vụ của bạn là tạo bài đăng truyền thông, bản tin loa phát thanh, và câu khẩu hiệu ngắn gọn, dễ hiểu, trực quan, ấm áp và cực kỳ thân thiện với người dân.

Tiêu chuẩn nội dung cơ bản:
1. Ngôn ngữ: Tiếng Việt tự nhiên, gần gũi, sử dụng các từ xưng hô thân mật như "Bà con", "Gia đình", "Chị em đi chợ", "Các bác chủ quán".
2. Cấu trúc rõ ràng: Ngắn gọn, ngắt dòng thoáng, dùng emoji trực quan (ngon lành, sạch sẻ, trái tim, tích xanh).
3. Độc đáo: Luôn sáng tạo thêm 1 bài thơ ngắn (4 câu lục bát hoặc 4 câu ngắn) dễ thuộc dễ nhớ cho người già và trẻ nhỏ.
4. Tránh từ ngữ hành chính khô cứng hay dọa dẫm. Thay vào đó dùng lời khuyên tích cực, hướng dẫn dễ làm ngay tại nhà.
5. Tạo 1 prompt tiếng Anh ngắn mô tả bức ảnh minh họa tuyên truyền tương ứng (hình vẽ đồ họa tươi sáng, phong cách mầm mầm/vector ấm áp, chợ quê sạch sẽ, mâm cơm gia đình).`;

    if (learnedStyleRules && Array.isArray(learnedStyleRules) && learnedStyleRules.length > 0) {
      systemInstruction += `\n\n🎯 QUY TẮC PHONG CÁCH BIÊN SOẠN AI ĐÃ HỌC TỪ CÁN BỘ PHƯỜNG:\nHãy đặc biệt tuân thủ các quy tắc phong cách đã được cán bộ điều chỉnh qua các bài trước:\n` +
        learnedStyleRules.map((rule: string, i: number) => `${i + 1}. ${rule}`).join('\n');
    }

    if (sampleEdits && Array.isArray(sampleEdits) && sampleEdits.length > 0) {
      systemInstruction += `\n\n📌 MẪU BÀI VIẾT ĐÃ ĐƯỢC CÁN BỘ PHƯỜNG DUYỆT & CHỈNH SỬA THỰC TẾ (HÃY HỌC THEO VĂN PHONG NÀY):\n` +
        sampleEdits.slice(0, 2).map((edit: any, idx: number) => `Mẫu ${idx + 1}:\n- Tiêu đề cán bộ thích: ${edit.editedTitle}\n- Nội dung cán bộ đã chỉnh sửa: ${edit.editedSocialContent}`).join('\n\n');
    }

    let promptText = `Hãy tạo nội dung tuyên truyền An toàn vệ sinh thực phẩm cho đơn vị: ${wardName}
Chủ đề / Yêu cầu: ${topic}
Chế độ đăng chính: ${postType}
Giọng văn: ${tone} (Thân thiện, Dễ hiểu, Trực quan)
Đối tượng tiếp nhận: ${targetAudience}
Độ dài: ${length}
Có hotline: ${includeHotline ? 'Có' : 'Không'}
Có hashtags: ${includeHashtags ? 'Có' : 'Không'}
Ghi chú bổ sung từ cán bộ: ${customNotes || 'Không'};`;

    if (newsReference) {
      promptText += `\n\n📰 BÀI BÁO THAM KHẢO TRÍCH XUẤT TỪ LINK BÁO CHÍ (${newsReference.sourceName || newsReference.url}):
- Tiêu đề bài báo: ${newsReference.title}
- Tóm tắt tin tức: ${newsReference.summary}
- Tình tiết / Cảnh báo chính từ báo chí: ${newsReference.keyFacts?.join('; ') || ''}
- Gợi ý vận dụng cho Phường: ${newsReference.suggestedAction || ''}

Hãy biên soạn lại tin tức báo chí trên thành bài tuyên truyền sát với thực tế ${wardName}, gần gũi với bà con nhân dân.`;
    }

    promptText += `\n\nYêu cầu trả về đúng định dạng JSON theo đúng schema quy định.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Tiêu đề ấn tượng, có emoji" },
            socialContent: { type: Type.STRING, description: "Nội dung bài đăng Facebook/Zalo thân thiện, ngắn gọn, dễ đọc" },
            broadcastScript: { type: Type.STRING, description: "Kịch bản đọc phát thanh loa phường 1-2 phút, giọng đọc lưu khoát, gần gũi" },
            shortSlogan: { type: Type.STRING, description: "Câu khẩu hiệu 1 dòng dễ nhớ" },
            rhyme: { type: Type.STRING, description: "Bài thơ/đồng dao 4 câu dễ thuộc" },
            imagePrompt: { type: Type.STRING, description: "English image generation prompt for propaganda illustration banner" },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 mẹo/điểm cốt lõi ngắn gọn"
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Danh sách hashtags phù hợp"
            }
          },
          required: ["title", "socialContent", "broadcastScript", "shortSlogan", "rhyme", "imagePrompt", "keyPoints", "hashtags"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    res.json({
      success: true,
      data: {
        id: "post-" + Date.now(),
        ...data,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        topic,
        wardName
      }
    });
  } catch (error: any) {
    console.error("Error generating content:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate content"
    });
  }
});

// API: Parse Article URL for News Context
app.post("/api/parse-article-url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, error: "URL bài báo không hợp lệ" });
    }

    let articleText = "";
    let extractedTitle = "";
    let domainName = "";

    try {
      const parsedUrl = new URL(url.trim());
      domainName = parsedUrl.hostname.replace(/^www\./, "");

      const fetchRes = await fetch(parsedUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8"
        }
      });

      if (fetchRes.ok) {
        const html = await fetchRes.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        if (titleMatch) {
          extractedTitle = titleMatch[1].replace(/\s+/g, " ").trim();
        }

        const cleanedHtml = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
          .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ");

        articleText = cleanedHtml.slice(0, 6000);
      }
    } catch (e) {
      console.warn("Fetch article warning:", url, e);
    }

    const ai = getGeminiClient();

    const systemInstruction = `Bạn là trợ lý AI phân tích và trích xuất tin tức báo chí chuyên nghiệp dành cho Cán bộ Tuyên truyền An toàn thực phẩm cấp Phường.
Nhiệm vụ của bạn là đọc thông tin từ bài báo và trích xuất tóm tắt ngắn gọn, các điểm quan trọng, số liệu chính, và đề xuất hướng vận dụng tuyên truyền cho bà con nhân dân cấp Phường.`;

    const promptText = `Hãy phân tích bài báo sau:
URL: ${url}
Nguồn báo (Domain): ${domainName || 'Báo chí'}
Tiêu đề nhận diện: ${extractedTitle || 'Bài viết báo chí'}
Nội dung thô trích xuất từ trang web:
${articleText || 'Hãy tổng hợp thông tin chính dựa theo tiêu đề và ngữ cảnh liên quan đến URL này.'}

Yêu cầu trả về đúng định dạng JSON theo schema:
- title: Tiêu đề bài báo ngắn gọn, rõ ràng.
- sourceName: Tên cơ quan báo chí (Ví dụ: VnExpress, Báo Tuổi Trẻ, Báo Lao Động, Báo Sức Khỏe & Đời Sống, v.v.).
- summary: Tóm tắt 2-3 câu nội dung chính.
- keyFacts: Mảng 3-4 tình tiết, số liệu, hoặc cảnh báo chính từ bài báo.
- suggestedAction: Lời khuyên/gợi ý hành động tuyên truyền địa phương sát với Phường.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            sourceName: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedAction: { type: Type.STRING }
          },
          required: ["title", "sourceName", "summary", "keyFacts", "suggestedAction"]
        }
      }
    });

    const resultData = JSON.parse(response.text || "{}");

    res.json({
      success: true,
      data: {
        url,
        title: resultData.title || extractedTitle || "Bài báo truyền thông ATTP",
        sourceName: resultData.sourceName || domainName || "Báo chí",
        summary: resultData.summary || "",
        keyFacts: resultData.keyFacts || [],
        suggestedAction: resultData.suggestedAction || ""
      }
    });
  } catch (error: any) {
    console.error("Error parsing article URL:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Không thể truy xuất thông tin từ link báo chí"
    });
  }
});

// API: Learn Style from User Edits
app.post("/api/learn-style", async (req, res) => {
  try {
    const { originalPost, editedPost, userNotes } = req.body;
    if (!editedPost) {
      return res.status(400).json({ success: false, error: "Thiếu dữ liệu bài viết đã sửa" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Bạn là Chuyên gia Phân tích Phong cách Biên soạn Truyền thông cho Cán bộ Phường.
Nhiệm vụ của bạn là so sánh phiên bản do AI tạo ban đầu với phiên bản đã được Cán bộ Phường chỉnh sửa trực tiếp, từ đó rút ra các quy tắc phong cách viết (style guidelines) cụ thể mà cán bộ ưa thích.`;

    const promptText = `So sánh hai phiên bản bài viết sau:

1. BẢN BAN ĐẦU DO AI TẠO:
Tiêu đề: ${originalPost?.title || ''}
Nội dung đăng: ${originalPost?.socialContent || ''}
Kịch bản phát thanh: ${originalPost?.broadcastScript || ''}
Khẩu hiệu: ${originalPost?.shortSlogan || ''}

2. BẢN CÁN BỘ PHƯỜNG ĐÃ SỬA THỰC TẾ:
Tiêu đề: ${editedPost.title || ''}
Nội dung đăng: ${editedPost.socialContent || ''}
Kịch bản phát thanh: ${editedPost.broadcastScript || ''}
Khẩu hiệu: ${editedPost.shortSlogan || ''}

Ghi chú bổ sung của cán bộ: ${userNotes || 'Không'};

Hãy phân tích và rút ra 2 đến 3 quy tắc phong cách viết nổi bật nhất mà cán bộ ưu tiên (Ví dụ: cách xưng hô, độ dài câu, cấu trúc các mục, lời nhắc nhở đặc thù địa phương, phong cách thơ vần...).
Trả về JSON chứa mảng newRules (mỗi quy tắc là 1 câu ngắn gọn, rõ ràng).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newRules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Danh sách 2-3 quy tắc phong cách rút ra được"
            },
            summary: {
              type: Type.STRING,
              description: "Tóm tắt ngắn gọn nhận xét về phong cách của cán bộ"
            }
          },
          required: ["newRules", "summary"]
        }
      }
    });

    const resultData = JSON.parse(response.text || "{}");

    res.json({
      success: true,
      newRules: resultData.newRules || [],
      summary: resultData.summary || "Đã ghi nhận phong cách biên soạn mới"
    });
  } catch (error: any) {
    console.error("Error learning style:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Chưa thể phân tích phong cách"
    });
  }
});

// API: Generate Speech (TTS for Broadcast Script)
app.post("/api/generate-speech", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: "Text is required" });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Đọc giọng bản tin phát thanh truyền thông phường rõ ràng, ấm áp, truyền cảm: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio returned from Gemini TTS");
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
    });
  } catch (error: any) {
    console.error("Error generating speech:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate speech audio"
    });
  }
});

// API: Generate Illustration Image
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    const fullPrompt = `${prompt}, colorful Vietnamese propaganda poster style, warm friendly aesthetic, high quality, vector graphic artwork, no text artifacts, clean edges`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Image generation did not return image data");
    }

    res.json({
      success: true,
      imageUrl
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate illustration image"
    });
  }
});

// Vite & Production Static Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

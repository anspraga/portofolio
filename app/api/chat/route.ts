import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_INSTRUCTION = `
Kamu adalah G-Assistant — asisten virtual cerdas dan representasi digital dari portofolio Annas Anuraga.

═══════════════════════════════════════
DATA PEMILIK
═══════════════════════════════════════
- Nama: Annas Anuraga (panggil: Annas)
- Domisili: Jakarta Utara
- Pendidikan: Teknik Informatika, Universitas Negeri Malang
- Keahlian Frontend: React, Next.js, Tailwind CSS, TypeScript, HTML, CSS, JavaScript
- Keahlian Backend: Node.js, Express.js, Java Spring Boot, Golang
- Keahlian Mobile: Flutter & Dart
- Tools: Git, GitHub, VS Code, Figma
- Komunitas: -
- Minat: Web development, UI/UX, teknologi cloud

═══════════════════════════════════════
ATURAN IDENTITAS
═══════════════════════════════════════
1. Kamu adalah G-Assistant. JANGAN pernah sebut nama model AI (Llama, Groq, OpenAI, dsb).
2. Sebut pemilik sebagai "Annas", BUKAN "Anuraga" atau "Putra".
3. Jika ditanya kamu siapa: "Saya G-Assistant, asisten virtual Annas"

═══════════════════════════════════════
KAPAN HARUS SEARCH
═══════════════════════════════════════
WAJIB gunakan web_search tool untuk:
- Berita terkini (politik, konflik, bencana, ekonomi, teknologi, olahraga, dll)
- Harga saham, kripto, kurs mata uang
- Cuaca terkini
- Event atau rilis terbaru (film, game, produk tech, dll)
- Pertanyaan apapun yang butuh data real-time atau informasi terbaru

JANGAN search untuk:
- Pertanyaan tentang Annas (gunakan data di atas)
- Pertanyaan coding/programming umum yang sudah diketahui
- Konsep atau definisi umum

═══════════════════════════════════════
GAYA KOMUNIKASI
═══════════════════════════════════════
- Santai tapi cerdas — gaya tech Jakarta (boleh pakai "lo/gue" jika user mulai duluan)
- Jawaban ringkas & padat: gunakan bullet points, bold untuk poin penting
- Gunakan emoji secukupnya
- Gunakan Markdown untuk kode
- Setelah search: ringkas hasil dengan bahasa natural, sebutkan sumber jika relevan

═══════════════════════════════════════
LOGIKA MENJAWAB
═══════════════════════════════════════
- Jawab SEMUA pertanyaan — tidak ada topik yang ditolak
- Pertanyaan teknis → jawab langsung dengan contoh kode jika perlu
- Arahkan ke section Project HANYA jika user tanya soal proyek Ali
- Arahkan ke section Contact HANYA jika user ingin menghubungi Ali
- Jika tidak yakin → jujur bilang tidak tahu, jangan mengarang

Ingat: kamu asisten yang genuinely helpful untuk semua pengunjung website Ali.
`;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const MAX_HISTORY_MESSAGES = 20;

// Tool definition untuk web search
const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'web_search',
      description:
        'Search the web for real-time or recent information. Use this for news, current events, prices, weather, and anything that requires up-to-date data.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to look up on the web',
          },
        },
        required: ['query'],
      },
    },
  },
];

// Fungsi search — prioritas Brave Search API, fallback ke DuckDuckGo
async function webSearch(query: string): Promise<string> {
  try {
    // Brave Search API (lebih akurat, butuh API key gratis di brave.com/search/api)
    if (process.env.BRAVE_SEARCH_API_KEY) {
      const res = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
        {
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        const results = data.web?.results ?? [];
        if (results.length === 0) return 'Tidak ada hasil ditemukan.';
        return results
          .slice(0, 5)
          .map(
            (r: { title: string; description: string; url: string }, i: number) =>
              `${i + 1}. **${r.title}**\n${r.description}\nSumber: ${r.url}`,
          )
          .join('\n\n');
      }
    }

    // Fallback: DuckDuckGo Instant Answer (gratis, tanpa key)
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
    );
    if (!res.ok) return 'Gagal melakukan pencarian.';
    const data = await res.json();

    const parts: string[] = [];
    if (data.AbstractText) parts.push(data.AbstractText);
    if (data.Answer) parts.push(`Jawaban langsung: ${data.Answer}`);
    if (data.RelatedTopics?.length > 0) {
      const topics = data.RelatedTopics.slice(0, 4)
        .filter((t: { Text?: string }) => t.Text)
        .map((t: { Text: string }) => `• ${t.Text}`);
      if (topics.length > 0) parts.push(topics.join('\n'));
    }

    return parts.length > 0
      ? parts.join('\n\n')
      : 'Tidak ditemukan informasi spesifik untuk query ini.';
  } catch (err) {
    console.error('Search error:', err);
    return 'Gagal melakukan pencarian saat ini.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: 'Pesan tidak valid.' }, { status: 400 });
    }

    const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);
    const formattedMessages: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      trimmedMessages.map((m: { role: string; content: string }) => ({
        role: m.role === 'ai' ? 'assistant' : (m.role as 'user' | 'assistant'),
        content: m.content,
      }));

    // Round 1: Kirim ke model dengan tools tersedia
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_INSTRUCTION }, ...formattedMessages],
      tools,
      tool_choice: 'auto',
      max_tokens: 2048,
      temperature: 0.5,
      top_p: 0.9,
      frequency_penalty: 0.3,
    });

    const choice = completion.choices[0];
    const assistantMessage = choice.message;

    // Jika model meminta web search
    if (choice.finish_reason === 'tool_calls' && assistantMessage.tool_calls?.length) {
      const toolCall = assistantMessage.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);
      const searchQuery = args.query as string;

      console.log(`[G-Assistant] Searching: "${searchQuery}"`);
      const searchResult = await webSearch(searchQuery);

      // Round 2: Kirim hasil search ke model untuk dirangkum
      const completion2 = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          ...formattedMessages,
          assistantMessage,
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: searchResult,
          },
        ],
        max_tokens: 2048,
        temperature: 0.5,
        top_p: 0.9,
        frequency_penalty: 0.3,
      });

      const finalText =
        completion2.choices[0]?.message?.content?.trim() ??
        'Maaf, saya sedang mengalami kendala teknis.';

      return NextResponse.json({ text: finalText });
    }

    // Tidak butuh search, langsung return
    const text =
      assistantMessage.content?.trim() ?? 'Maaf, saya sedang mengalami kendala teknis.';
    return NextResponse.json({ text });

  } catch (error: unknown) {
    console.error('Groq API error:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as { status: number }).status === 429
    ) {
      return NextResponse.json(
        { text: 'Asisten sedang sibuk, tunggu sebentar lalu coba lagi ya!' },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { text: 'Maaf, terjadi kesalahan. Silakan refresh dan coba lagi!' },
      { status: 500 },
    );
  }
}
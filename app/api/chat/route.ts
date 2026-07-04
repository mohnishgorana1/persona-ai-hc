import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
<system_prompt_architecture>
  <persona_identity>
    <name>Hitesh Choudhary</name>
    <role>Elite Tech Educator, Full-Stack Software Architect, Serial Entrepreneur.</role>
    <current_focus>Leading the "GenAI with JS 2026" cohort. Passionate about Agentic workflows.</current_focus>
    <core_ethos>Documentation is the ultimate truth. Build core engineering skills.</core_ethos>
  </persona_identity>

  <verified_sources>
    When answering questions about courses, platforms, or cohorts, ONLY rely on these exact platforms. DO NOT guess pricing.
    - Main Website & Cohorts (GenAI, Web Dev): https://chaicode.com
    - VOD Courses: https://courses.chaicode.com
    - DSA & Practice: https://masterji.co
    - Documentation: https://docs.chaicode.com
    - API Practice: https://freeapi.app
  </verified_sources>

  <social_handles>
    - YouTube (Hindi): "Chai aur Code"
    - YouTube (English): "Hitesh Choudhary"
    - LinkedIn/Twitter/Instagram/GitHub: "@hiteshchoudhary"
  </social_handles>

  <linguistic_engine>
    <languages>Professional English seamlessly mixed with natural, casual Hindi (Hinglish).</languages>
    <tone>Direct, warm, grounded, highly practical. Act as a big brother/mentor.</tone>
    <signature_phrases>
      - "Haanji! Kese ho aap sabhi"
      - "Dekho yaar, simple si baat hai..."
      - "Chai piyo, code karo!"
    </signature_phrases>
  </linguistic_engine>

  <anti_hallucination_rules>
    1. NEVER guess course fees, cohort dates, or syllabus details. If you don't know, use the "tavily_search" tool.
    2. When using "tavily_search" for ChaiCode related queries, append "site:chaicode.com" or "site:courses.chaicode.com" to your search query to get accurate data.
    3. If the search tool fails to find the exact price, simply say: "Exact details ke liye ek baar chaicode.com check kar lo yaar." DO NOT invent prices like 4 lac.
  </anti_hallucination_rules>

  <chain_of_thought_protocol>
    You are an autonomous reasoning agent. Process EVERY user query through a strict 5-step cognitive loop.
    If you need real-time data, use the "tavily_search" tool FIRST before starting the 5-step JSON loop.
    
    1. "understand": Analyze user's query.
    2. "explore": Brainstorm concepts. Identify if you need to search verified_sources.
    3. "compute": Formulate logic.
    4. "crosscheck": Validate accuracy. Check for hallucinations.
    5. "wrap_up": Deliver final response in Hitesh's Hinglish tone. MUST format all code snippets perfectly using markdown blockticks with the correct language tag.
  </chain_of_thought_protocol>

  <strict_output_format>
    You MUST respond ONLY with a valid JSON OBJECT containing a "steps" array. 
    Schema:
    {
      "steps": [
        { "step": "understand", "content": "string" },
        { "step": "explore", "content": "string" },
        { "step": "compute", "content": "string" },
        { "step": "crosscheck", "content": "string" },
        { "step": "wrap_up", "content": "string (Make sure to escape newlines as \\n within code snippets)" }
      ]
    }
  </strict_output_format>
</system_prompt_architecture>
`;

// 🛠️ The Tavily Search Tool Definition
const tools = [
  {
    type: "function" as const,
    function: {
      name: "tavily_search",
      description: "Search the web for real-time data. Use specific site operators like 'site:chaicode.com' when looking for Hitesh Choudhary's courses, pricing, or cohorts.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The highly optimized search query. Include 'site:chaicode.com' for course specific queries.",
          },
        },
        required: ["query"],
      },
    },
  },
];

// 🌐 Real Tavily Search Implementation
async function performWebSearch(query: string) {
  console.log(`\n🔍 [Tool Execution]: Searching Tavily for -> "${query}"`);
  
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: "advanced",
        include_answer: false,
        max_results: 3, 
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json();
    
    const formattedResults = data.results.map((r: any) => ({
      title: r.title,
      content: r.content,
      url: r.url
    }));

    return JSON.stringify(formattedResults);
  } catch (error) {
    console.error("Tavily Search Error:", error);
    return JSON.stringify({ error: "Failed to fetch real-time data." });
  }
}

export async function POST(req: Request) {
  try {
    // 🔥 Yahan humne req.json() se userName bhi extract kar liya
    const { messages, userName } = await req.json();

    // 🔥 Dynamic System Prompt - AI ko explicitly user ka naam bata diya
    const DYNAMIC_SYSTEM_PROMPT = SYSTEM_PROMPT + `\n<user_context>\nThe user you are talking to is named "${userName || 'Student'}". Always remember their name and address them warmly in your responses when appropriate.\n</user_context>`;

    const apiMessages: any[] = [
      { role: "system", content: DYNAMIC_SYSTEM_PROMPT },
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    let response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: apiMessages,
      tools: tools,
      tool_choice: "auto", 
      temperature: 0.1, 
      response_format: { type: "json_object" }
    });

    let message = response.choices[0].message;

    if (message.tool_calls) {
      apiMessages.push(message);

      for (const toolCall of message.tool_calls) {
        if (toolCall.function.name === "tavily_search") {
          const args = JSON.parse(toolCall.function.arguments);
          const searchResult = await performWebSearch(args.query);

          apiMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: searchResult,
          });
        }
      }

      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.1,
        response_format: { type: "json_object" } 
      });

      message = response.choices[0].message;
    }

    const rawOutput = message.content || "{}";

    try {
      const parsedData = JSON.parse(rawOutput);
      const stepsArray = parsedData.steps || []; 
      
      return NextResponse.json({ success: true, steps: stepsArray });
    } catch (parseError) {
      console.error("JSON Parse Error. Raw Output:", rawOutput);
      throw new Error("AI did not return valid JSON");
    }

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch response." },
      { status: 500 }
    );
  }
}
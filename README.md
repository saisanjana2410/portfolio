# Sai Sanjana Portfolio + Ask Sanjana

Interactive portfolio with seven project case studies, filters, orbital art, a floating assistant, conversational history, source links, and reduced-motion support.

## Start

Node.js 22 or later, no dependencies required:

```powershell
npm start
```

Open http://127.0.0.1:3000. Without an API key, Ask Sanjana explicitly runs as local portfolio search. Opening index.html directly uses the offline curated guide.

## Enable AI

Copy .env.example to .env and set OPENAI_API_KEY privately on your machine. Never put the key in browser code or share it in chat. OPENAI_MODEL is configurable. Restart the server. The status label will show AI mode.

The AI calls a read-only search_portfolio tool, retrieves supplied facts, and returns answers with case-study links. Multi-turn history stays in the current page memory and clears on reload or New conversation. Questions and retrieved portfolio facts are sent to OpenAI when AI mode is enabled. Responses use store:false. No transcripts are written by this application.

## Validation

npm test

Checks retrieval, static responses, input validation, origin enforcement, and private-file exclusion. A real AI call requires a valid API key and is not covered by these tests.

## Files

index.html: page content. styles.css: design and animation. app.js: project knowledge and existing interactions. agent.js: conversational UI. server.mjs: static server, retrieval tool, Responses API integration. The original content handoff is kept locally and excluded from Git and HTTP access.

The server only serves allowlisted public assets. It applies input limits and a small in-memory request limit. Before public deployment, use HTTPS hosting with server-side secrets and deployment-level abuse/spend controls. See DEPLOY.md and render.yaml for hosting.

Project illustrations are conceptual previews, not application screenshots. Unsupported metrics, unconfirmed GPA, unknown employment dates, and missing personal origin stories are omitted.


## Deploy

See [DEPLOY.md](DEPLOY.md) for Render and other Node hosts. The top portrait is static; no blinking animation is loaded.

## Live agent tools

With OPENAI_API_KEY configured, Ask Sanjana uses the Responses API with five tools: search_portfolio, get_profile, get_project, find_skill_evidence, and show_portfolio_section. The model chooses tools, receives their results, and composes an answer. Source buttons and a tool-usage summary appear with responses. Navigation tools offer buttons; they do not send messages or perform external actions. Seven offline tests cover retrieval, validation, tool dispatch and bounded model/tool loops.

## Public company research

The agent also has OpenAI's built-in web_search tool. Company overview questions such as “What is Ooftish?” trigger web retrieval and clickable inline source citations. Personal-role questions continue to use portfolio evidence. This is live web retrieval, not a persistent vector database or a direct Google API integration. Web search incurs provider tool usage charges. Ten offline tests cover the agent and citations.

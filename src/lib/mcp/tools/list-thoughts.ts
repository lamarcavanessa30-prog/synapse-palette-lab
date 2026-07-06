import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_recent_thoughts",
  title: "List recent thoughts",
  description:
    "List the user's most recent journal thoughts captured in Hu-Mind, newest first.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe("Maximum number of thoughts to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ limit }) => {
    const thoughts: Array<{ date: string; text: string }> = [];
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              note: "Sprint 1 stores thoughts in the browser. MCP tools will connect when server persistence is introduced.",
              limit,
              thoughts,
            },
            null,
            2,
          ),
        },
      ],
      structuredContent: { thoughts },
    };
  },
});

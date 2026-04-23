import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Teja Blog Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [deskTool(), codeInput()],
  schema: {
    types: schemaTypes,
  },
});

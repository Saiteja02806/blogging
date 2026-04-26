import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Teja Blog Studio",
  projectId: "udcnv62y",
  dataset: "production",
  plugins: [deskTool(), codeInput()],
  schema: {
    types: schemaTypes,
  },
});

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { post } from "./schemas/post";

export default defineConfig({
  name:      "default",
  title:     "Around You Jos",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  plugins:   [structureTool()],
  schema:    { types: [post] },
  basePath:  "/studio",
});

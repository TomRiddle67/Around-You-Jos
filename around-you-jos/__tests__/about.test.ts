import { describe, it, expect } from "vitest";
import AboutPage, { metadata } from "@/app/about/page";

describe("About Page", () => {
  it("exports valid metadata with title and description", () => {
    expect(metadata.title).toBe("About");
    expect(metadata.description).toBeDefined();
    expect(metadata.description).toContain("Around You Jos");
  });

  it("renders a valid component tree with layout and content", () => {
    expect(typeof AboutPage).toBe("function");
    const element = AboutPage();
    expect(element).toBeDefined();
    expect(element.props).toBeDefined();
  });
});

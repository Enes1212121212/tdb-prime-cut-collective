import { render, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IntroFilm } from "@/components/intro-film";

afterEach(() => vi.restoreAllMocks());

function mediaSetup(reducedMotion = false) {
  vi.stubGlobal("matchMedia", () => ({ matches: reducedMotion }));
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  return vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
}

describe("Opening film", () => {
  it("starts automatically once and retains the final still after ending", async () => {
    const play = mediaSetup();
    const { container } = render(<IntroFilm />);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
    const video = container.querySelector("video");
    if (!video) throw new Error("Missing opening video");
    fireEvent.playing(video);
    expect(container.firstElementChild?.getAttribute("data-intro-state")).toBe("playing");
    fireEvent.ended(video);
    expect(container.firstElementChild?.getAttribute("data-intro-state")).toBe("still");
    expect(play).toHaveBeenCalledTimes(1);
    expect(video.loop).toBe(false);
  });

  it("shows only the still when reduced motion is requested", () => {
    const play = mediaSetup(true);
    const { container } = render(<IntroFilm />);
    expect(play).not.toHaveBeenCalled();
    expect(container.firstElementChild?.getAttribute("data-intro-state")).toBe("still");
  });
});
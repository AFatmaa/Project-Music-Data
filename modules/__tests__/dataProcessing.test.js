import { findMostPlayedSong } from "../dataProcessing.js";

describe("findMostPlayedSong", () => {
  test("returns the most played song when multiple songs exist", () => {
    const events = [
      { song_id: "1" },
      { song_id: "2" },
      { song_id: "1" },
      { song_id: "3" },
      { song_id: "1" },
      { song_id: "2" }
    ];

    const result = findMostPlayedSong(events);
    expect(result).toEqual({ song_id: "1", count: 3 });
  });

  test("returns null if no events are provided", () => {
    const result = findMostPlayedSong([]);
    expect(result).toBeNull();
  });

  test("returns null if input is null or undefined", () => {
    expect(findMostPlayedSong(null)).toBeNull();
    expect(findMostPlayedSong(undefined)).toBeNull();
  });

  test("returns the only song if there's just one unique song", () => {
    const events = [{ song_id: "42" }];
    const result = findMostPlayedSong(events);
    expect(result).toEqual({ song_id: "42", count: 1 });
  });
});

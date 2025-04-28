jest.mock("../models/Metadata", () => {
  return {
    find: jest.fn(), // we will override it in the tests
  };
});

const request = require("supertest");
const app = require("../app");
const Metadata = require("../models/Metadata");

describe("GET /api/search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted search results", async () => {
    const mockResults = [
      {
        _id: "1",
        fileName: "Test File",
        description: "This is a test",
        category: "Documents",
        fileUrl: "http://localhost/test.pdf",
        uploadedBy: "Alice",
        uploadedAt: new Date(),
      },
    ];

    Metadata.find.mockImplementation(() => ({
      sort: () => ({
        limit: () => Promise.resolve(mockResults),
      }),
    }));

    const res = await request(app).get("/api/search?q=test");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("id", "1");
    expect(res.body[0]).toHaveProperty("title", "Test File");
    expect(res.body[0]).toHaveProperty("excerpt", "This is a test");
    expect(res.body[0]).toHaveProperty("type", "Documents");
    expect(res.body[0]).toHaveProperty("fileUrl", "http://localhost/test.pdf");
    expect(res.body[0]).toHaveProperty("relevance");
  });

  it("should handle internal server error", async () => {
    Metadata.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    const res = await request(app).get("/api/search?q=test");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Internal Server Error");
  });
});


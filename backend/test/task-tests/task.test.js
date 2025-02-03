const request = require("supertest");
const app = require("../../index");
const Models = require("../../models");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb25nb0lEIjoiNjc5MDgxM2EzYzNjODU5Mjg4YWRlYTBlIiwiZW1haWwiOiJ1ZGF5M0BnbWFpbC5jb20iLCJpYXQiOjE3Mzg1NjM2OTUsImV4cCI6MTczOTQyNzY5NX0.nXlay1JPMschBHwLzAMfcJkccBip6MMgjts8kjeQRGo";

jest.mock("../../models");

describe("Task API", () => {

  test("should get a task by ID", async () => {
    Models.Task.findOne.mockResolvedValue({ title: "Task 1", status: "Pending" });
    const res = await request(app).get("/api/tasks/1").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test("should update a task", async () => {
    Models.Task.findById.mockResolvedValue({ _id: "1", status: "Pending" });
    Models.Task.findByIdAndUpdate.mockResolvedValue({ _id: "1", status: "Completed" });
    const res = await request(app).put("/api/tasks/1").set("Authorization", `Bearer ${token}`).send({ status: "Completed" });
    expect(res.status).toBe(200);
  });

  test("should delete a task", async () => {
    Models.Task.findByIdAndDelete.mockResolvedValue({ _id: "1" });
    const res = await request(app).delete("/api/tasks/1").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

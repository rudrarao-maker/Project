const jwt = require("jsonwebtoken");

describe("Authentication Utilities", () => {
  const secret = "test-secret-key";
  const payload = { id: 1, role: "user" };
  
  it("should successfully generate a valid JWT token", () => {
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    expect(token).toBeDefined();
    
    const decoded = jwt.verify(token, secret);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
  });
  
  it("should fail verification with an invalid secret", () => {
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    expect(() => {
      jwt.verify(token, "wrong-secret");
    }).toThrow();
  });
});

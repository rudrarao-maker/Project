const app = require("./app");
const config = require("./config");
const http = require("http");
const { initSocket } = require("./chatSocket");

const PORT = config.port;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║     🇮🇳  GOV E-SERVICES API SERVER  🇮🇳          ║
  ╠════════════════════════════════════════════════╣
  ║  Status:      Running ✅                       ║
  ║  Port:        ${PORT}                            ║
  ║  Environment: ${config.nodeEnv.padEnd(30)}║
  ║  API Base:    http://localhost:${PORT}/api        ║
  ║  Health:      http://localhost:${PORT}/api/health ║
  ╚════════════════════════════════════════════════╝
  `);
});

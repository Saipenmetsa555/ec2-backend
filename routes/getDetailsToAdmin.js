// import pkg from "pg";
// import WebSocket from "ws";
// const { Pool } = pkg;

// // PostgreSQL Pool
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "digitrade",
//   password: "varma",
//   port: 5432,
// });

// // Function to create a WebSocket server
// const createWebSocketServer = (httpServer) => {
//   const wss = new Server({ noServer: true }); // Create WebSocket server

//   wss.on("connection", (ws) => {
//     console.log("New WebSocket connection");

//     // Fetch admin data when a client connects
//     (async () => {
//       try {
//         const getQuery = `SELECT * FROM perminent_user_details WHERE Status = 'not approved'`;
//         const result = await pool.query(getQuery);
//         ws.send(JSON.stringify(result.rows)); // Send the fetched data to the client
//       } catch (err) {
//         console.error(err);
//         ws.send(JSON.stringify({ error: "Failed to fetch data" }));
//       }
//     })();

//     ws.on("close", () => {
//       console.log("WebSocket connection closed");
//     });
//   });

//   // Upgrade HTTP server to handle WebSocket requests
//   httpServer.on("upgrade", (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//       wss.emit("connection", ws, request);
//     });
//   });
// };

// export { createWebSocketServer };

// import pkg from "pg";
// import WebSocket from "ws";
// // Change this line
// const { Pool } = pkg;

// // PostgreSQL Pool
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "digitrade",
//   password: "varma",
//   port: 5432,
// });

// // Function to create a WebSocket server
// const createWebSocketServer = (httpServer) => {
//   const wss = new WebSocket.Server({ noServer: true }); // Update here as well

//   wss.on("connection", (ws) => {
//     console.log("New WebSocket connection");

//     // Fetch admin data when a client connects
//     (async () => {
//       try {
//         const getQuery = `SELECT * FROM perminent_user_details WHERE Status = 'not approved'`;
//         const result = await pool.query(getQuery);
//         ws.send(JSON.stringify(result.rows)); // Send the fetched data to the client
//       } catch (err) {
//         console.error(err);
//         ws.send(JSON.stringify({ error: "Failed to fetch data" }));
//       }
//     })();

//     ws.on("close", () => {
//       console.log("WebSocket connection closed");
//     });
//   });

//   // Upgrade HTTP server to handle WebSocket requests
//   httpServer.on("upgrade", (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//       wss.emit("connection", ws, request);
//     });
//   });
// };

// export { createWebSocketServer };

import { WebSocketServer } from "ws"; // Correct import for WebSocketServer

// PostgreSQL Pool setup
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});

// Function to create a WebSocket server
const createWebSocketServer = (httpServer) => {
  const wss = new WebSocketServer({ noServer: true }); // Correct usage of WebSocketServer

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    // Fetch admin data when a client connects
    (async () => {
      try {
        const getQuery = `SELECT * FROM perminent_user_details WHERE status = 'not approved'`;
        const result = await pool.query(getQuery);
        ws.send(JSON.stringify(result.rows)); // Send the fetched data to the client
      } catch (err) {
        console.error(err);
        ws.send(JSON.stringify({ error: "Failed to fetch data" }));
      }
    })();

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  // Upgrade HTTP server to handle WebSocket requests
  httpServer.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
};

export { createWebSocketServer };

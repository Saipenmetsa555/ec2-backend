import express from "express";
import cors from "cors";
// import { getData } from "./routes/login.js";
import insertInitialUser from "./routes/defaultuser.js";
import {
  registerTemporaryDetails,
  adminApprovalUsersGet,
} from "./routes/registeruser.js";
import { temporaryDetailsGet } from "./routes/temporaryDetails.js";
import { periment, notApproveUser } from "./routes/perimentDetails.js";
import { loginDetails } from "./routes/login.js";
// import { createWebSocketServer } from "./routes/getDetailsToAdmin.js";

import { orderReceived, orderPlaced } from "./routes/order.js";
import { orderGet, orderData } from "./routes/order.js";

import { sendInvoice, invoiceGet } from "./routes/invoice.js";

import { receivedOrdersFromUser } from "./routes/receiveOrdersbyName.js";
import { updateInvoiceStatus } from "./routes/receiveOrdersbyName.js";
import { getOrderDetailsToAdmin } from "./routes/receiveOrdersbyName.js";
import { updateInvoiceStatusByAdmin } from "./routes/receiveOrdersbyName.js";
import { getInvoiceByUser } from "./routes/receiveOrdersbyName.js";

const app = express();
const port = 4000;

insertInitialUser();
app.use(express.json());
app.use(cors());

app.use("/registerDetails", registerTemporaryDetails);
app.use("/userApprovalAdmin", adminApprovalUsersGet);

app.use("/temporaryDetailsGet", temporaryDetailsGet);
app.use("/perimentDataStore", periment);
app.use("/cancelApproveToUser", notApproveUser);

app.use("/login", loginDetails);

app.use("/orderPlace", orderPlaced);
app.use("/orderGet", orderGet);
app.use("/adminApprovedOrder", orderReceived);
app.use("/", orderData);

app.use("/sendInvoice", sendInvoice);
app.use("/invoiceGet", invoiceGet);

app.use("/", receivedOrdersFromUser);
app.use("/", updateInvoiceStatus);
app.use("/", getOrderDetailsToAdmin);
app.use("/", updateInvoiceStatusByAdmin);
app.use("/", getInvoiceByUser);

app.listen(port, () => {
  console.log(`SERVER RUNNING at ${port}`);
});

// createWebSocketServer(server);

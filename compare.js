import protobuf from "protobufjs";
import path from "path";
import { readFile } from "fs/promises";
import { formatMac } from "./formatMac.js";

// Parse Site Survey JSON
const jsonData = JSON.parse(
  await readFile(path.join(process.cwd(), "sitesurvey.json"))
);

const root = await protobuf.load(path.join(process.cwd(), "sitesurvey.proto"));

const siteSurvey = root.lookupType("asset_tracker_v2.WiFiSiteSurvey");

// Create the protobuf message, convert Mac addresses to long to further save data
// We don't have to use short keys (v, chan) for the protobuf message (as in the JSON)
// and can use full, descriptive names.
const message = siteSurvey.create({
  ...jsonData,
  accesspoints: jsonData.v.map(({ mac, chan, ...rest }) => ({
    ...rest,
    channel: chan,
    mac: BigInt(`0x${mac.replace(/:/g, "")}`).toString(),
  })),
});
const encoded = siteSurvey.encode(message).finish();

// Decode the payload, restoring the original MAC address formatting
const decoded = siteSurvey.decode(encoded);
console.log({
  ...decoded,
  v: decoded.accesspoints.map(({ mac, ...rest }) => ({
    ...rest,
    mac: formatMac(parseInt(mac, 10).toString(16)),
  })),
});

console.log(`Found APs`, jsonData.v.length);
console.log(`JSON payload length:`, JSON.stringify(jsonData).length, "bytes");
console.log(
  `Protobuf payload length:`,
  encoded.length,
  "bytes",
  `(${Math.round((encoded.length / JSON.stringify(jsonData).length) * 100)}%)`
);

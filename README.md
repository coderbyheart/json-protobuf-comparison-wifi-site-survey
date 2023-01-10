# Compares JSON to Protobuf message format for a WiFi site survey

Encodes a [WiFi site survey](./sitesurvey.json) as [protobuf3](https://developers.google.com/protocol-buffers/docs/proto3) for comparing message payload sizes.

```bash
npm ci
node compare.js

# Found APs 30
# JSON payload length: 1949 bytes
# Protobuf payload length: 713 bytes (37%)
```

---
id: filecoin.js.httpjsonrpcwalletprovider.estimatemessagegas
title: HttpJsonRpcWalletProvider.estimateMessageGas() method
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[filecoin.js](./filecoin.js.md) &gt; [HttpJsonRpcWalletProvider](./filecoin.js.httpjsonrpcwalletprovider.md) &gt; [estimateMessageGas](./filecoin.js.httpjsonrpcwalletprovider.estimatemessagegas.md)

## HttpJsonRpcWalletProvider.estimateMessageGas() method

estimate gas to succesufully send message, and have it included in the next 10 blocks

<b>Signature:</b>

```typescript
estimateMessageGas(message: Message): Promise<Message>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  message | Message |  |

<b>Returns:</b>

Promise&lt;Message&gt;
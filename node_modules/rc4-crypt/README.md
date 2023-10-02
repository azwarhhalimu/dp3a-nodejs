# rc4-crypt

> Small rc4 cryptography library

## Install

```bash
npm install --save rc4-crypt
```

## Usage

### Node.JS

```js
const rc4 = require('rc4-crypt');

// Initialize encrypt/decrypt
// The keys need to match
let encrypt = rc4("ENCRYPTION KEY"),
    decrypt = rc4("ENCRYPTION KEY");

// The data we're about to encrypt
let plainData = "Hello World";

// Actually encrypt the data
let ciphertext = encrypt(plainData);

// Let's decrypt it again
let decrypted = decrypt(ciphertext);

// Show the result
console.log(decrypted);
```

### Browser

This module does not directly work in the browser. You'll need to use a tool like [browserify][browserify] to make use
it.

[browserify]: https://npmjs.com/package/browserify
[ws]: https://npmjs.com/package/ws
[websocket]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

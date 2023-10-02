// Basic RC4 implementation, I forgot where the code originally was based on
// If you recognize it, please let me know so I can credit the right person

module.exports = ((Buffer) => {
  const isBuffer = require('is-buffer');

  function toByteArray(subject) {

    // Already-parsed (sort-of)
    if (!subject) return null;
    if (Array.isArray(subject)) return subject;
    if (isBuffer(subject)) return [...subject];
    if ('string' !== typeof subject) return null;

    // Hex strings
    if (subject.match(/^([0-9a-f]{2})*$/i)) {
      return subject
        .match(/[0-9a-f]{2}/ig)
        .map(c => parseInt(c, 16));
    }

    // Use the string as bytes
    return [...Buffer.from(subject, 'utf8')];
  }

  return function RC4(key) {
    key = toByteArray(key);

    let i, x, y = 0, t, x2, s = [];
    for (i = 0; i < 256; i++) s[i] = i;
    for (x = 0; x < 256; x++) {
      y    = (key[x % key.length] + s[x] + y) % 256;
      t    = s[x];
      s[x] = s[y];
      s[y] = t
    }
    x = y = 0;

    return function coder(data) {
      if (isBuffer(data)) return Buffer.from([...data].map(coder));
      if ('string' === typeof data) return Buffer.from([...Buffer.from(data)].map(coder));
      if ('number' !== typeof data) return false;
      x2    = (x++) % 256;
      y     = (s[x2] + y) % 256;
      t     = s[x2];
      s[x2] = s[y];
      s[y]  = t;
      return data ^ s[(s[x2] + s[y]) % 256]
    }
  };
})('function' === typeof Buffer ? Buffer : require('buffer').Buffer);

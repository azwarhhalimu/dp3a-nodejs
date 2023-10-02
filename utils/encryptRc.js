const { base64encode, base64decode } = require("nodejs-base64");
const RC4 = require("./Rc4")
const key = "348290jjjifud83409q";
const c = new RC4();
const encryptRc = (plaintext) => {


    const encrypt = c.encrypt(key, plaintext);
    return base64encode(encrypt);
}
const decryptRc = (chipertext) => {
    const cdecored = base64decode(chipertext);
    const dec = c.decrypt(key, cdecored);
    return dec;
}

module.exports = { encryptRc, decryptRc }
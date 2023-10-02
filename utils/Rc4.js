module.exports = class RC4 {
    constructor() {
        this.S = [];
    }

    swap(v1, v2) {
        [this.S[v1], this.S[v2]] = [this.S[v2], this.S[v1]];
    }

    KSA(key) {
        let idx = this.crc32(key);
        if (!this.S[idx]) {
            this.S[idx] = [...Array(256).keys()];
            let j = 0;
            const n = key.length;

            for (let i = 0; i < 256; i++) {
                const char = key.charCodeAt(i % n);
                j = (j + this.S[i] + char) % 256;
                this.swap(i, j);
            }
        }
        return this.S[idx];
    }

    encrypt(key, data) {
        this.S = this.KSA(key);
        let i = 0;
        let j = 0;
        const dataArray = data.split('').map(char => char.charCodeAt(0));

        for (let m = 0; m < dataArray.length; m++) {
            i = (i + 1) % 256;
            j = (j + this.S[i]) % 256;
            this.swap(i, j);
            const char = dataArray[m];
            dataArray[m] = this.S[(this.S[i] + this.S[j]) % 256] ^ char;
        }
        return String.fromCharCode.apply(null, dataArray);
    }

    decrypt(key, data) {
        return this.encrypt(key, data);
    }

    crc32(str) {
        let crc = -1;
        for (let i = 0; i < str.length; i++) {
            crc ^= str.charCodeAt(i);
            for (let j = 0; j < 8; j++) {
                crc = (crc >> 1) ^ (-(crc & 1) & 0xEDB88320);
            }
        }
        return (crc ^ -1) >>> 0;
    }
}
/* Using Native SHA-256 Algorithm */
const SHA256 = {
    sha256Buffer: async function(buffer) {
        return crypto.subtle.digest('SHA-256', buffer).then(function(hashBuffer) {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
            return hashHex;
        });
    },
    sha256Text: async function(text) {
        return this.sha256Buffer(new TextEncoder('utf-8').encode(text));
    }
};
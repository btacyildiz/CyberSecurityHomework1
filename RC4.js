const N = 256

class CipherSuite{

    static RC4Encrypt(plaintext, plainLen,  password, passLen){
        var bufferPlain = new Buffer(plaintext)
        var bufferKey = new Buffer(password)
        console.log("Plain Text: " + plaintext  + " \nPassword: " + password)
        const S = CipherSuite.KSA(bufferKey, passLen)
        return CipherSuite.PRGA(S, bufferPlain, plainLen)
    }

    /**
     * Mix the key
     * Preparation algorith for RC4 encryption
     * @param {*} key 
     */
    static KSA(key, len){
        let S = []
        var j = 0
        for(var i = 0; i< N; i++){
            S[i] = i
        }
        for(var i = 0; i< N; i++){
            j = ( j + S[i] + key[i % len]) % N
            // swap 
            var temp = S[i]
            S[i] = S[j]
            S[j] = temp
        }
        return S
    }

    static PRGA(S, plaintext, len){
        let ciphertext = new Buffer(len)
        let i = 0
        let j = 0
        for(var n= 0 ; n < len ; n++ ){
            i = (i + 1) % N 
            j = (j + S[i]) % N
            // swap 
            var temp = S[i]
            S[i] = S[j]
            S[j] = temp
            var rnd = S[ ( S[i] + S[j] ) % N]
            ciphertext[n] = rnd ^ plaintext[n]
        }
        return ciphertext
    }
}

module.exports = CipherSuite
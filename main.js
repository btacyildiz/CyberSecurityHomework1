const cipher = require("./RC4")

var plain = "AttackTomorrow"
var pass = "1234"
var start = Date.now()
const cipherText = cipher.RC4Encrypt(plain, plain.length, pass, pass.length)
console.log(new Buffer(cipherText).toString("hex"))
console.log("Diff Time: " + (Date.now() - start)) 

console.log("121231231".toString(2))
//console.log(new Buffer("10000000").toString(2))
var RC4BitArray = ""
var cipherText = new Buffer("123412321")
for(var i = 0 ; i < cipherText.length; i++){
    RC4BitArray += cipherText[i].toString(2)
}
console.log(RC4BitArray)
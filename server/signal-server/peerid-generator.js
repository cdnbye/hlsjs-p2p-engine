

module.exports = function getPeerId() {

    //20位
    // var num = Math.floor(Math.random()*10000000000);
    // // }
    // // console.log(str.toString('base64'));
    // var buffer = new ArrayBuffer()
    // console.log(num.toString('base64'));

    var len = 9;
    var timestamp = parseInt((new Date()).valueOf()/1000);


    var  x="0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    var  tmp="";
    for(var  i=0;i<  len;i++)  {
        tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }

    return  timestamp+tmp;


}

// console.log(peerId());

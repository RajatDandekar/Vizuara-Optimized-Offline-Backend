const { Firebase } = require('./utilities/getData');
const  { firebase } = require('./connection/firebase');
const functions = require("firebase-functions");

var productkeys = [];

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
    return result;
}
                                
exports.generate_product_key = functions.region('asia-south1').https.
                                onRequest(async (req, res) => {
    if(req.query.count != null){
        var new_keys = "";
                                                                    
        res.attachment('Generated_Product_Keys.txt')
        res.type('txt')
        console.log("Number of Keys generated: " + req.query.count);
                                                                    
        for (let i = 0; i < req.query.count; i++) { 
            var new_key = makeid(20);
            productkeys.push(new_key);
            new_keys += new_key + '\n';
        }
        
        res.send(new_keys);
        res.end();
                                                                    
        Generation++;
        return;
    }
    res.end();
});

exports.check_product_key = functions.region('asia-south1').https.
                            onRequest(async (req, res) => {
    if(req.query.value != null){
        if(productkeys.includes(req.query.value)){
            productkeys = productkeys.filter(function(item){
                return item != req.query.value;
            })
            res.end("1");
                                                                
        }else{
            res.end("0");
        }
    }
    res.end();
});
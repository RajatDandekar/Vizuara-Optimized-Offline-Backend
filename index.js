const express = require('express')
const app = express()
const port = 8111

var Generation = 0;

var productkeys = [];

app.get("/generate_product_key", function (req, res) {
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

app.get("/check_product_key", function (req,res) {
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

app.listen(port);

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
const express = require('express')
const app = express()
const port = 8111
const {Client} = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const db_client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl:true
})

const connectDb = async () => {
    try {
    
        await db_client.connect()
        //const res = await db_client.query("SELECT * FROM 'ID'")
        //console.log(res)
    } catch (error) {
        console.log(error)
    }
}
connectDb()

var Generation = 0;

var productkeys = [];


app.get("/generate_product_key", function (req, res) {
    if(req.query.count != null){
        var new_keys = "";
    
        res.attachment('Generated_Product_Keys.txt')
        res.type('txt')
        console.log("Number of Keys generated: " + req.query.count);
        
        var query = 'INSERT INTO "ID" (id) VALUES '

        for (let i = 0; i < req.query.count; i++) { 
            var new_key = makeid(20);
            //productkeys.push(new_key);
            new_keys += new_key + '\n';
            query += "('"+new_key+"')";
            if(i == req.query.count - 1){
                query += ";";
            }else{
                query += ",";
            }
        }
        //console.log(query);
        db_client.query(query).then((query_result) => {
            //console.log(query_result);
        })

        res.send(new_keys);
        res.end();
    
        Generation++;
        return;
      }
});

app.get("/check_product_key", async function (req,res) {
    if(req.query.value != null){

        query = "SELECT * from \"ID\" where id = '"+req.query.value+"'";

        try{
            db_client.query(query).then((query_result) => {
                console.log(query_result.rowCount);
                if(query_result.rowCount == "1"){

                    query = "DELETE FROM \"ID\" where id='"+req.query.value+"';"
                    db_client.query(query).then((query_result) => {
                        res.end("1")
                    })
                }else{
                    res.end("0");
                }
            })
        }catch(error){
            res.end("0")
        }
    }else{
        res.end();
    }
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
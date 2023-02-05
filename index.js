const { Firebase } = require('./utilities/getData');
const  { firebase } = require('./connection/firebase');
const functions = require("firebase-functions");

const express = require('express')
const app = express()
const port = 9010

const classinfoname = "info";
const index = "index";
const link = "link";
const name = "name";
const subname = "subname"

var productkeys = [];

async function Get_JSON_STRING(){
return Firebase.getAllDocumentsWithSubCollections().then(OriginalData => {

    //Getting basic class info
    let ClassesInfo = OriginalData.map(ClassData => {

        var ClassObject = new Object();
        var collection_name = ClassData.collection;

        if(ClassData.docs == "info"){

            ClassObject[collection_name] =  {
                    "N" : ClassData.field.name,
                    "I" : ClassData.field.index,
                    "C" :
                            OriginalData.map(ChapterData => {
                                if(ChapterData.docs != "info" && ChapterData.collection == collection_name){
                                    var ChapterObject = new Object();
                                    var ChapterCollectionName = ChapterData.docs;

                                    ChapterObject[ChapterCollectionName] = {
                                        "N": ChapterData.field.name,
                                        "P": ChapterData.field.subname,
                                        "I": ChapterData.field.index,
                                        "L": ChapterData.field.link
                                    }
                                    return ChapterObject
                                }else{
                                    false
                                }
                            }).filter(x => x != false && x != null)
                }
            return ClassObject;
        }else{
            return false;
        }
    })
    

    //Filtering Class Info
    ClassInfoFilterResult = ClassesInfo.filter(value => value != false);

    let counter = 1;

    let FinalString = "{    \n"
                    +"    \"O1xqt41b\":\"\",  \n"
    +"    \"UaYp2sG1\": \"\", \n"
    ClassInfoFilterResult.forEach(ClassesInfo => {
        FinalString += "    \""+counter+"\" : { \n"

        let individual_class = ClassesInfo[""+counter]

        FinalString += "        \"N\" : \""+individual_class.N+"\",  \n" 
        FinalString += "        \"I\" : \""+individual_class.I+"\",  \n"
        FinalString += "        \"C\" : {   \n"
        
        let chapter_counter = 1;
        
        ChaptersInfo = individual_class["C"];
        ChaptersInfo.forEach(ChapterInfo =>{

            FinalString += "            \""+chapter_counter+"\": { \n";
            ChapterData = ChapterInfo[""+ chapter_counter];

            FinalString += "                \"N\": \""+ChapterData["N"]+"\", \n"
            FinalString += "                \"P\": \""+ChapterData["P"]+"\", \n"
            FinalString += "                \"I\": \""+ChapterData["I"]+"\", \n"
            FinalString += "                \"L\": \""+ChapterData["L"]+"\" \n"

            if(chapter_counter != ChaptersInfo.length){
                FinalString += "            }, \n";
            }else{
                FinalString += "            } \n";
            }

            chapter_counter++;
        })

        FinalString += "        } \n"

        if(counter != ClassInfoFilterResult.length){
            FinalString += "    }, \n"
        }else{
            FinalString += "    } \n"
        }
        counter++;
    });
    FinalString += "}";

    return FinalString;
    //console.log(JSON.stringify(ClassInfoFilterResult));
})
}

/*
  app.get('/', async (req, res) => {
    
    Get_JSON_STRING().then(value =>{
        res.attachment('data_struct_key_file.json')
        res.type('json')
        res.send(value)
    })
    /*res.attachment('data_struct_key_file.json')
    res.type('json')
    res.send(text)
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })*/

  exports.generate_json_file =   functions.region('asia-south1')
                                    .https.onRequest(async (req, res) => {
                                        Get_JSON_STRING().then(value =>{
                                        res.attachment('data_struct_key_file.json')
                                        res.type('json')
                                        res.send(value)
                                    })
                                });


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
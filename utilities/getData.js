const { firebase } = require('../connection/firebase');

class Firebase {
    constructor(){

    }
    static async getAllCollections() {
        let collections = [];
        await firebase.listCollections()
        .then(snapshot=>{
            snapshot.forEach(snaps => {
                collections.push(snaps["_queryOptions"].collectionId);
            })
        })
        .catch(error => console.error(error));
        return collections;
    }
    static async getAllDocuments() {
        return await this.getAllCollections().then(async collections => {
            let docs = []
            for(let collection of collections){
                await firebase.collection(collection).get().then((querySnapshot) => {
                    const tempDoc = []
                    querySnapshot.forEach((doc) => {
                        tempDoc.push({ collection : collection, docs: doc.id, Link : doc.data() }) 
                        //tempDoc.push({ collection : collection, docs: doc.id, Link : Object.values(doc.data()) })
                    })
                   docs.push(tempDoc);
                })
            }
            return docs
        })
    }
    static async getSubCollection(collection, docs) {
        let sub_collections = [];
        const sfRef = firebase.collection(collection).doc(docs);
        const colls = await sfRef.listCollections();
        for(let coll of colls){
            sub_collections.push(coll.id)
        }
        return sub_collections;
    }
    
    static async getAllDocumentsWithSubCollections() {
        return await this.getAllDocuments().then(async data => {
            let updated_docs = [];
            for(let [ioc, collection] of data.entries()){
                for(let [iod, docs] of collection.entries()){
                    await this.getSubCollection(docs.collection, docs.docs).then(sub_collections => {
                        updated_docs.push({
                            collection : docs.collection,
                            docs : docs.docs,
                            field : docs.Link,
                            sub_collections : sub_collections
                        })
                    })
                    
                }
            }
            return updated_docs;
        })
    }
}

module.exports = {
    Firebase
}
const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');
const BlockClass = require('./block.js');
  
  /* ===== Blockchain Class ==============================
  |  Class with a constructor for blockchain data model  |
  |  with functions to support:                          |                           |
  |     - getLatestBlock()                               |
  |     - addBlock()                                     |
  |     - getBlock()                                     |
  |     - validateBlock()                                |
  |     - validateChain()                                |
    ====================================================*/
  
class Blockchain{
    constructor(){
     // new chain array
    this.chain = [];

    // Create Gensis Block
    this.addBlock("Genesis block");
}


    // BLOCKCHAIN CONSTRUCTION METHOD: addBlock method
    addBlock(data){
        let self = this;
        return new Promise(async (resolve, reject) => {

            // Create block object 
            let newBlock = new BlockClass.Block(data.toString());


            // Convert Data to Hex
            newBlock.data = Buffer.alloc(newBlock.data.length, newBlock.data).toString('hex')
            
            // Block hight
            newBlock.height = self.chain.length;

            //Add timestamp
            newBlock.timeStamp = new Date().getTime().toString();

            // calculate and update the previous hash
            if (self.chain.length>0) {
                newBlock.previousHash = self.chain[self.chain.length-1].hash
            }
            
            // calculate and update the new hash
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

            // Push block and validate sucssess
            let previousHight = self.chain.length; // Capture Previous Hight
            self.chain.push(newBlock); // push block to the chain
            let newHight = self.chain.length; // Capture new Hight

            // Check blockchain hight
            if (newHight === previousHight + 1) {
                console.log('NEW BLOCK ADDED')
                console.log(newBlock)
                resolve(newBlock)
            }
            
            // Thow Err
            else {
                reject('False')
            }

        });
    }


    // BLOCKCHAIN QUERY METHOD: getLatestBlock(), returns latest block
    getLatestBlock(){
        let self = this;
        return new Promise(async (resolve) => {
            resolve(self.chain[self.chain.length - 1]) //Return the latest item in the chain
        });
    }

    // BLOCKCHAIN QUERY METHOD: getBlock(), returns block by hash.
    getBlock(blockQuery){
        let self = this;
        return new Promise(async (resolve, reject) => {

            // check for match by height
            self.chain.filter(self => {
                if(self.height.toString() == blockQuery.toString()) {
                    resolve(self.blockDecode())
                }
            }); 

            // check for match by Hash
            self.chain.filter(self => {
                if(self.hash.toString() == blockQuery.toString()) {
                    resolve(self.blockDecode())
                }
            }); 

            reject('Error 404: Block Not Found')

        });
    }

    // BLOCKCHAIN QUERY METHOD: validateChain(), calls the validate method on each block
    validateChain(){
        let self = this;
        return new Promise(async (resolve, reject) => {

            for (let i = 0; i < self.chain.length - 1; i++) { // Iterate through the blockchain
                
                self.chain[i].validate() // Call validate on each block
                .catch(error => {
                    reject('Block Validation Error Block: ' + i.toString) // Catch errors and throw error
                });
                
                // Check if hash is correctly used in next block
                //if (self.chain[i].hash != self.chain[i].previousHash) { //fix me maybe iterate backwards as i is coming out of range
                   //reject('Inproper previous hash Block: ' + self.chain[i].toString) FIX ME
                //}
            }

            resolve('True') // Resolve if no errs thrown

        });
    }
  }  

  module.exports.Blockchain = Blockchain;     

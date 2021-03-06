const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');
  
  /* ===== Blockchain Class ==============================
  |  Class with a constructor for blockchain data model  |
    ====================================================*/
  
class Blockchain{
    constructor(){
     // new chain array
    this.chain = [];
    // Create Gensis Block
    this.addBlock("Genesis block", "Admin");
}
       /**
     * The  addBlock(data, owner) method takes adds data onto the blockchain. this method
     * is private and should only be called by other methods after authenticating the address.
     * @param {*} data
     * @param {*} owner
     */
    addBlock(data, owner){
        let self = this;
        return new Promise(async (resolve, reject) => {

            // Create block object 
            let newBlock = new BlockClass.Block(data);


            // Convert Data to Hex
            newBlock.owner = owner;
            
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
                self.validateChain().then(response => { // If validate works success
                    console.log('NEW BLOCK ADDED')
                    console.log(newBlock)
                    resolve(newBlock)
                }, reason => { // If validate fails return error and pop block
                    self.chain.pop();
                    resolve (reason)
                });       
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

    /**
     * The getBlock(blockQuery) method takes either a hight or an hash as input and
     * filteres for the relevant critera.
     * @param {*} blockQuery
     */
    getBlock(blockQuery){
        let self = this;
        let bQ = blockQuery;
        return new Promise(async (resolve, reject) => {

            // check for match by height
            self.chain.filter(self => {
                if(self.height.toString() == bQ.toString()) {
                    resolve(self.blockDecode())
                }
            }); 
            // check for match by Hash
            self.chain.filter(self => {
                console.log(self.hash)
                console.log(blockQuery.toString())
                if(self.hash.toString() == bQ.toString()) {
                    resolve(self.blockDecode())
                }
            }); 

            resolve()

        });
    }

      /**
     * The validateChain() method iterates through the blockchain and calls the
     * validate method on each block object. This recalculates and compares the hash.
     */
    validateChain(){
        let self = this;
        let previousHash = "0x";
        return new Promise(async (resolve, reject) => {

            for (let i = 0; i < self.chain.length - 1; i++) { // Iterate through the blockchain
                
                self.chain[i].validate() // Call validate on each block
                .catch(error => {
                    reject('The Chain has been tampered with') // Catch errors and throw error
                });

                if (previousHash !=  self.chain[i].previousHash) {
                    reject('The Chain has been tampered with')
                }
                previousHash = self.chain[i].hash;
            }

            resolve('The Chain integrity is good') // Resolve if no errs thrown

        });
    }

    /**
     * The requestOwnership(address) method will use the address provided to create
     * a unique time senstive message which is a challenge to the user to prove they
     * own a wallet. They need to sign this message and use it when submitting blocks.
     * Resolves with the challenge message.
     * @param {*} address 
     */
    requestOwnership(address) {
        return new Promise((resolve) => {
            let message = `${address}:${new Date().getTime().toString().slice(0,-3)}:starRegistry`;
            resolve(message)
        
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * @param {*} address 
     * @param {*} message 
     * @param {*} signature 
     * @param {*} star 
     */
    submitStar(add, mes, sig, sta) {
        let self = this;
        let message = mes
        let address = add
        let signature = sig
        let star = sta
        return new Promise(async (resolve, reject) => {
            let signedtime = parseInt(message.split(':')[1]);
            let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));

            if ((currentTime - signedtime) > 300) { // Check sig has been done in last five minutes.
                resolve('Err Renew Signature')
            } else {
                try {
                    if ((bitcoinMessage.verify(message, address, signature.toString())).toString() == 'true') {
                        self.addBlock(star, address).then(block => {
                            resolve(block)
                        });
                    }
                } catch(error) {
                    resolve(error)
                }
            }
        });
    }

   /**
     * The getStarsByWalletAddress(addr) method takes a wallet address
     * as input and iterates through the chain searching for stars that
     * belong to the address. Returns a JSON object of stars.
     * reject with an error.
     * @param {*} addr 
     */
    getStarsByWalletAddress(addr) {
        let self = this;
        let address = addr;
        let stars = [];
        return new Promise (async (resolve, reject) => {
           
           try {
                for(let i = 0; i < self.chain.length; i++ ) {
                    if (self.chain[i].owner == address) {
                        stars.push(JSON.parse(hex2ascii(self.chain[i].data)))
                    }
                resolve(stars)
            }
            resolve
           } catch (error) {
               console.log(error)
           }
            
        });
    }
  }  

  module.exports.Blockchain = Blockchain;     

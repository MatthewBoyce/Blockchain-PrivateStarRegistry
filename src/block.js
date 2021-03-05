const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

/* ===== Block Class ===================================
|  Class with a constructor for block data model       |
|  ====================================================*/

class Block {
    constructor(data, owner){
      this.height = '';
      this.timeStamp = '';
      this.owner = owner;
      this.data = Buffer(JSON.stringify(data)).toString('hex');
      this.previousHash = '0x';
      this.hash = '';
    }
    
    // When called this method checks to see if block has been tampered with
    validate() {
        let self = this;
        return new Promise(async (resolve, reject) => {
            
            let orginal_hash = self.hash; // Save hash before comparing it
            self.hash = ''; // Clear hash
            let new_hash = SHA256(JSON.stringify(self)).toString(); // recalculate hash
            self.hash = orginal_hash // put hash back

            if (orginal_hash == new_hash) { // Check the new and old hash match
                resolve('True')
            } else { // Else throw ERR
                reject('False')
            }
        });
    }

    // When called this method retrns the data unencoded
    blockDecode() {
        let self = this;
        return new Promise(async (resolve) => { // Return JSON Obj Decoded
            let blockClone = JSON.parse(JSON.stringify(self));
            blockClone.data = JSON.parse(hex2ascii(blockClone.data))
            resolve(blockClone)
        });
    }


  } // End of block Class

  module.exports.Block = Block;     
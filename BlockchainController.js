
/* ===== Blockcain Controller Class ===================
|  Make API calls avaliable                            |
|  ====================================================*/

class BlockchainController {
        //The constructor receive the instance of the express.js app and the Blockchain class
    constructor(app, blockchainObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        
        // Call endpoints to init route
        this.submitBlock();
        this.getBlock();
        
    }
    // Submit Block Endpoint
    submitBlock() {
        this.app.post("/submitblock", async (req, res ) => {
            if(req.body.data) { // Check required field are included
                try {
                    let block = await this.blockchain.addBlock(req.body.data.toString());
                    if (block) {
                        return res.status(200).json(block);
                    } else {
                        return res.status(500).send("An error happened!");
                    }
                } catch (error) { 
                    return res.status(500).send(error);
                }
            }
            else { // Throw ERR if data not included in request
                return res.status(500).send("ERR \'data\' expected ")
            }
        });
    }

    getBlock() {
        this.app.get("/block/:hash", async (req, res) => {

            if(req.params.hash) { //Check for paramater hash 
                const hash = req.params.hash.toString() // Set parameter hash as a const
                this.blockchain.getBlock(hash).then(response => { // Call getblock method
                        return res.status(200).json(response) // Return Block
                }) .catch(error => {
                        return res.status(404).send(error) // Return Error
                });
            } else { // throw err if no hash is provided
                return res.status(500).send("ERR expecting paramater hash");
            }
        });
    }
}

module.exports = (app, blockchainObj) => { return new BlockchainController(app, blockchainObj);}

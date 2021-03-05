
/* ===== Blockcain Controller Class ===================
|  Make API calls avaliable                            |
|  ====================================================*/

const { sign } = require("bitcoinjs-message");

class BlockchainController {
        //The constructor receive the instance of the express.js app and the Blockchain class
    constructor(app, blockchainObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        
        // Call endpoints to init route
        this.getBlockByHeight();
        this.getBlockByHash();
        this.requestOwnership();
        this.SubmitStar();
        this.getStarsByOwner();
        this.validateChain();
        
    }

    // Enpoint to Get a Block by Height (GET Endpoint)
    getBlockByHeight() {
        this.app.get("/block/:height", async (req, res) => {
            if(req.params.height) {
                const height = req.params.height;
                let block = await this.blockchain.getBlock(height);
                if(block){
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

    // Endpoint that allows user to get a block based on its hash (GET Endpoint)
    getBlockByHash() {
        this.app.get("/block/:hash", async (req, res) => {
            if(req.params.hash) {
                const hash = req.params.hash;
                let block = await this.blockchain.getBlock(hash);
                if(block){
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

    // Endpoint that allows user to request Ownership of a Wallet address (POST Endpoint)
    requestOwnership() {
        this.app.post("/requestValidation/", async (req, res) => {
            if(req.body.address) { // Check for params
                const address = req.body.address;
                const message = await this.blockchain.requestOwnership(address);
                if (message) {
                    return res.status(200).json(message);
                } else {    
                    return res.status(500).send("An error happened!");
                }
            } else { // IF params are missing throw err.
                return res.status(500).send("Missing Arguments, expected \'Address\' to be validated.")
            }
        });
    }

    // Endpoint used to add stars (POST Endpoint)
    SubmitStar() {
        this.app.post("/Submitstar", async (req, res) => {
            if(req.body.address && req.body.message && req.body.signature && req.body.star) {
                const address = req.body.address;
                const message = req.body.message;
                const signature = req.body.signature;
                const star = req.body.star;
                try {
                    let block = await this.blockchain.submitStar(address, message, signature, star);
                    if (block) {
                        return res.status(200).json(block);
                    } else {
                        return res.status(500).send("An Error Happened!");
                    }
                } catch (error) {
                    return res.status(500).send(error);
                }
            } else {
                return res.status(500).send(error);
            }

        });
    }

    // This endpoint allows you to request the list of Stars registered by an owner
    getStarsByOwner() {
        this.app.get("/blocks/:address", async (req, res) => {
            if(req.params.address) {
                const address = req.params.address;
                try {
                    let stars = await this.blockchain.getStarsByWalletAddress(address);
                    if(stars){
                        return res.status(200).json(stars);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                } catch (error) {
                    console.log(error)
                    return res.status(500).send("An error happened!!");
                   
                }
            } else {
                return res.status(500).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

    // This endpoint calls the validateChain method and returns true or false
    validateChain() {
        this.app.get("/validateChain", async (req, res) => {
            try {
                this.blockchain.validateChain().then(response => {
                    return res.status(200).send(response)
                });
            } catch (error) {

            }
        });

    }
}

module.exports = (app, blockchainObj) => { return new BlockchainController(app, blockchainObj);}

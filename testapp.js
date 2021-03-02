// Purely for testing BlockClass and Blockchain Class 
// without the use of express

const BlockClass = require('./src/block.js');
const BlockchainClass = require('./src/blockchain.js');


// Create TestChain
let blockchain = new BlockchainClass.Blockchain()

// Add three blocks to the chain
blockchain.addBlock('ABDC')
.then(console.log('adding block 1'))

blockchain.addBlock('4TSRGSF')
.then(console.log('adding block 2'))

blockchain.addBlock('Matt is cool')
.then(console.log('adding block 3'))

//Print the whole Blockchain
console.log(blockchain.chain)

// Test Latest Block
blockchain.getLatestBlock()
.then(latestblock_local => {
    console.log('Searching for...')
    console.log(latestblock_local)

    // Test Get Block by getting the latest block
    blockchain.getBlock(latestblock_local)
    .then( (retrevedblock_local) => {
        console.log(retrevedblock_local);
    });
});

blockchain.validateChain()
.then(response => {
    console.log('Chain Validation ' + response)
}) 
.catch( error => {
    console.log('Chain Validation ' + error)
}); // Test validate chain method
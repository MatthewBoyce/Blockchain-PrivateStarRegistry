# Boyce-Coins Star Registery

Basic POC for a private blockchain that uses the blockchain data model to register and verify ownership of discovered stars. Verification is integrated with legacy Bitcoin-Core wallets. Build using OO Javascript, Promises, Express, Crypto.js, Hex2Ascii and bitcoinjs-message.

Contents
- /src/block.js - Class file for block.
- /src/blockchain.js - Class file for blockchain.
- app.js - Initalises server class to start express service.
- blockchainContoler.js - contains the endpoints that bridge the express service with the blockchain/block class.

SetUp:
1. Pull Repo
2. NPM Install dependencies
3. run app.js with node
4. Interact with the below endpoints described in usage.

Step 1:  Send your bitcoin core wallet address to the /requestValidation/ endpoint. This will return a time sensitive and unique challenge that you will need to sign to prove you own the address.
<img src="https://github.com/MatthewBoyce/boyce-coin/blob/main/gifs/requestValidation.gif"/>

Step 2: Sign the challenge.
<img src="https://github.com/MatthewBoyce/boyce-coin/blob/main/gifs/SignMessage.gif"/>

Step 3: Submit your star/stars to the /SubmitStar/ endpoint. In the star data include the coordinates, time found and your own personal story of how you found it. To successfully register your star you will need to provide your wallet address along with the challenge and the signed challenge that you produced in step 2.
<img src="https://github.com/MatthewBoyce/boyce-coin/blob/main/gifs/SubmitStar.gif" />

Step 4: Show off your stars to all your friends and use the immutable ledger to prove when you first discovered a star so you can evidence your achievements. Use the /blocks/ endpoint to provide your bitcoin address and get a list of all the stars you have registered.
<img src="https://github.com/MatthewBoyce/boyce-coin/blob/main/gifs/StarsByWallet.gif" />

Step 5: Call the validate chain endpoint to have the program check the integrity and position of each block on the chain to see if anything has been tampered with.
<img src="https://github.com/MatthewBoyce/boyce-coin/blob/main/gifs/Validate%20Chain.gif" />

MISC: Use the /block/ endpoint to provide either a block height or a hash to return a specific block or transaction.
<img src="https://github.com/MatthewBoyce/boyce-coin/blob/main/gifs/BlockbyHeight.gif"  />


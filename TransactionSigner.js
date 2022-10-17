"use strict";
let express = require('express');
let bodyParser = require('body-parser');
let Web3 = require('web3');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

require('dotenv').config({ path: '.env' }); // update process.env.

const mode = process.env.MODE;
let validationAddress;

if (mode == "cohort")
    validationAddress = process.env.VALIDATIONS_COHORT_ADDRESS;
else 
    validationAddress = process.env.VALIDATIONS_NO_COHORT_ADDRESS;



const endPoint = process.env.MUMBAI_SERVER;
const transactionSignerPort = process.env.TRANSACTION_SIGNER_PORT;
console.log("transactionSignerPort:"+ transactionSignerPort);

// const web3 = createAlchemyWeb3(endPoint);
let web3 = new Web3(endPoint);


const fs = require('fs');

let app = express();
let privateKey;
let publicKey;
let nonce;

app.use(express.static('private'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Add headers

app.use(function (req, res, next) {

    // Website you wish to allow to connect

    let allowedOrigins = ['http://localhost:8181'];
    let origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

async function sign(data, nonce) {

    try {

        if (data.startsWith("0x42d47412") || data.startsWith("0xd4632bcf") || data.startsWith("0x87c77617") || data.startsWith('0xbe5d7aef')) {

            let gasPrice = Number(await web3.eth.getGasPrice()) + 100000000; //add extra 5% to ensure validation
            let gas;
            try {
                gas = await web3.eth.estimateGas({
                    to: validationAddress,
                    data: data,
                    from: publicKey,
                })
            } catch (error) {

                console.log("gas error:", error);
                console.log("to:", validationAddress);
                console.log("data", data);
                console.log("from", publicKey);


                
            }
            // if (data.startsWith("0x42d47412")   || data.startsWith("0xd4632bcf") )
            //     gas = 900000;
            // else 
            //     gas = 900000;

            console.log("gasPrice ", gasPrice);
            console.log("gas ", gas);

            if (gasPrice < 33000000000)
                gasPrice = 33000000000


            const transaction = {
                'to': validationAddress,
                'value': 0,
                'gas': gas,
                'maxFeePerGas': gasPrice,
                'maxPriorityFeePerGas': gasPrice,
                'nonce': nonce,
                'data': data,
            };

            const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
            return signedTx.rawTransaction;
        }
        else
            return "Not approved call";
    } catch (error) {
        console.log(error);
    }
}


app.get('/storePrivateKey', async function (req, res) {

    try {

        privateKey = req.query.privateKey
        publicKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        nonce = await web3.eth.getTransactionCount(publicKey, 'latest');
        console.log("Key created from:", req.ip, new Date());
        console.log("public key:", publicKey);
        console.log("starting nonce:", nonce);
        console.log('\n');

        res.end();
    } catch (error) {
        console.log(error);
    }
});


app.get('/getPublicKey', function (req, res) {
    console.log("Public Key accessed from:", req.ip, new Date());
    console.log('\n');

    if (privateKey)
        res.end(web3.eth.accounts.privateKeyToAccount(privateKey).address);
    else
        res.end("Not initialized");

})

app.get('/sign', async function (req, res) {

    let data = req.query.data;
    let nonce = req.query.nonce;

    try {
        console.log("Signature requested:", req.ip, new Date());
        console.log("data:", data);
        console.log("nonce:", nonce);
        console.log('\n');

        const signedTx = await sign(data, nonce);
        res.end(JSON.stringify(signedTx));

    } catch (err) {
        console.log(err)
        res.end(err)
    }
})

let server = app.listen(transactionSignerPort, function () {
    let host = server.address().address
    let port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})
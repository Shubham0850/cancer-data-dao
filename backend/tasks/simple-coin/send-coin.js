const util = require("util")
const request = util.promisify(require("request"))

task("send-coin", "Sends CureDao")
    .addParam("contractaddress", "The CureDao address")
    .addParam("amount", "The amount to send")
    .addParam("toaccount", "The account to send to")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contractaddress
        const amount = taskArgs.amount
        const toAccount = taskArgs.toaccount
        const networkId = network.name
        const CureDao = await ethers.getContractFactory("CureDao")
        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]
        const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

        async function callRpc(method, params) {
            var options = {
                method: "POST",
                url: "https://wallaby.node.glif.io/rpc/v0",
                // url: "http://localhost:1234/rpc/v0",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: method,
                    params: params,
                    id: 1,
                }),
            }
            const res = await request(options)
            return JSON.parse(res.body).result
        }

        const cureDaoContract = new ethers.Contract(contractAddr, CureDao.interface, signer)
        console.log("Sending:", amount, "CureDao to", toAccount)
        await cureDaoContract.sendCoin(toAccount, amount, {
            gasLimit: 1000000000,
            maxPriorityFeePerGas: priorityFee,
        })
        let result = BigInt(await cureDaoContract.getBalance(toAccount)).toString()
        console.log("Total CureDao at:", toAccount, "is", result)
    })

module.exports = {}

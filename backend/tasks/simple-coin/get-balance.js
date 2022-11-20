task(
    "get-balance",
    "Calls the simple coin Contract to read the amount of CureDaos owned by the account."
)
    .addParam("contract", "The address the CureDao contract")
    .addParam("account", "The address of the account you want the balance for")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        const account = taskArgs.account
        const networkId = network.name
        console.log("Reading CureDao owned by", account, " on network ", networkId)
        const CureDao = await ethers.getContractFactory("CureDao")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        const cureDaoContract = new ethers.Contract(contractAddr, CureDao.interface, signer)
        let result = BigInt(await cureDaoContract.getBalance(account)).toString()
        console.log("Data is: ", result)
    })

module.exports = {}

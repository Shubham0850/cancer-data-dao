const { ethers, network } = require("hardhat")
const fs = require("fs")

module.exports = async function () {
    await updateAbi()
    await updateAddresses()
}

const abiPath = "../constants/"
const mappingPath = "../constants/networkMapping.json"

const updateAbi = async () => {
    const cureDao = await ethers.getContract("CureDao")

    let _interface = cureDao.interface.format(ethers.utils.FormatTypes.json)
    fs.writeFileSync(abiPath + "CureDao.json", _interface)
}

const updateAddresses = async () => {
    const cureDao = await ethers.getContract("CureDao")

    const contractAddresses = await JSON.parse(fs.readFileSync(mappingPath, "utf8"))
    const chainId = "31415"

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["CureDao"]) {
            contractAddresses[chainId]["CureDao"] = [cureDao.address]
        } else {
            contractAddresses[chainId]["CureDao"].pop()
            contractAddresses[chainId]["CureDao"].push(cureDao.address)
        }
    } else {
        contractAddresses[chainId] = { ["CureDao"]: [cureDao.address] }
    }

    fs.writeFileSync(mappingPath, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]

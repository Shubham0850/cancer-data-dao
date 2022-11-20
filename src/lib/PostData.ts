import Airtable from 'airtable'
import axios from 'axios'
import { Web3Storage } from 'web3.storage'

function makeStorageClient() {
	return new Web3Storage({
		token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhGRkVhZWY3OURhQjFDQjRGMzdkODdlNDA1MTAyOEQ1MEM0NkYyQjYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg5NTg1OTU4ODUsIm5hbWUiOiJjdXJlLWRhbyJ9.KFYft0RLJfayJUGOCvcQ-BVcqrRrEj-cQ09cffP9Ano',
	})
}

export const sendDataToIpfsWeb3Storage = async data => {
	const client = makeStorageClient()
	const cid = await client.put("hello")
	console.log('stored files with cid:', cid)
	return cid
}

export const sendDataToIPFS = async data => {
	const config = {
		method: 'post',
		url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
		headers: {
			'Content-Type': 'application/json',
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzZWJmMmVlMS1iNWRlLTRjMGItOTllOS01MDJjZGZhZWRiOWYiLCJlbWFpbCI6InJhanNodWJoYW0yOTZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjI0ODkxNWU5Y2MxYWIzM2M0YmU2Iiwic2NvcGVkS2V5U2VjcmV0IjoiOTI0OTM1MTlmMTgzYTYzYzA5ZTA2YTEwNmVkY2ZlYmVjZWRhNWI1NDc1Mjc1ZjBhN2NmNmQ5M2Q5NzY0YTAzOCIsImlhdCI6MTY2ODk1OTMyOX0.E33bFG6rw45ncQxI0ZkNse0uEMuzSUY13bReyOtLFQk',
		},
		data: JSON.stringify(data),
	}

	const res = await axios(config)

	console.log('hello form api', res)

	const ImgHash = `${res.data.IpfsHash}`

	return ImgHash
}

export const sendDataToAirtable = async ({ bettingPoolAddress, ipfsCID }) => {
	const base = new Airtable({
		apiKey: 'keyVYimKxVOx4feiz',
	}).base('apprIQfulYNRE7hUL')

	base('BettingPoolDB').create(
		[
			{
				fields: {
					bettingPoolAddress: bettingPoolAddress,
					ipfsCID: ipfsCID,
				},
			},
		],
		function (err, records) {
			if (err) {
				return err
			}
			return records
		}
	)
}

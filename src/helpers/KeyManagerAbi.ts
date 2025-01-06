export const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nftType",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "addNewKey",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nftType",
				"type": "string"
			}
		],
		"name": "getDeterminsticKey",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nftType",
				"type": "string"
			}
		],
		"name": "getKey",
		"outputs": [
			{
				"internalType": "euint64",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nftType",
				"type": "string"
			},
			{
				"internalType": "einput",
				"name": "encryptedKeyOfCourse",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "proof",
				"type": "bytes"
			}
		],
		"name": "storeKey",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
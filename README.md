# CreativeMarketplace - Chainhack(Hackathon)

### Git method
```bash
git clone https://github.com/fiore/CreativeMarketplace-Chainhack-Hackathon
```

```bash
cd CreativeMarketplace-Chainhack-Hackathon

npm install
```

### Prerequisites
```bash
# Install Truffle if not installed
npm install -g truffle

# Install Ganache if not installed
https://truffleframework.com/ganache

# Install MetaMask if not installed
https://metamask.io
```

### Configuration
```bash
cd CreativeMarketplace-Chainhack-Hackathon

# Migrate the Smart Contracts
truffle migrate

# If problems
truffle migrate --reset

# Run the server
npm run dev
```

#### Set Local TestNet
![](https://github.com/fiore/CreativeMarketplace-Chainhack-Hackathon/blob/master/gif/gif1.gif)

#### Copy the account(s) private key
![](https://github.com/fiore/CreativeMarketplace-Chainhack-Hackathon/blob/master/gif/gif2.gif)

#### And import it in MetaMask
![](https://github.com/fiore/CreativeMarketplace-Chainhack-Hackathon/blob/master/gif/gif3.gif)

#### Troubleshooting
If you restart Ganache after you have done some transactions, you may have occured in this console error, with a rejected Transaction
```javascript
Error: Invalid JSON RPC response: {"id":8,"jsonrpc":"2.0","error":{"code":-32603}}
at Object.InvalidResponse (inpage.js:14308)

Error: Invalid JSON RPC response: {"id":9,"jsonrpc":"2.0","error":{"code":-32603}}
at Object.InvalidResponse (inpage.js:14308)

Error: Error: Error: [ethjs-rpc] rpc error with payload {"id":2465245573393,"jsonrpc":"2.0","params":["0xf88...253"],"method":"eth_sendRawTransaction"}
Error: the tx doesn't have the correct nonce. account has nonce of: 0 tx has nonce of: 5
```

The solution is to reset the MetaMask account


![](https://github.com/fiore/CreativeMarketplace-Chainhack-Hackathon/blob/master/gif/gif4.gif)

And after run a new migration
```bash
cd CreativeMarketplace-Chainhack-Hackathon

truffle migrate --reset

# Run the server
npm run dev
```
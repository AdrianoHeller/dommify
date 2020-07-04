const Block = require('./Block')
const cryptoHash = require('crypto')

class Blockchain{
  constructor(genesisBlock){
    this.blockList = []
    this.addBlock(genesisBlock)	  
  }
  addBlock(block){
    this.blockList.length === 0 ? block.previousHash = '000000000000000000000000' : false;
    block.hash = this.generateBlockHashPattern(block);		  
    this.blockList.push(block);	
  }

  generateNextBlock(transactions){
     const currentBlock = new Block();
     transactions instanceOf 'Array' ? transactions.forEach(item => {
       currentBlock.addTransaction(item)
     }) : false;
     const previousBlock = this.recoverPreviousBlock(this.blockList);
     currentBlock.position = this.blockList.length;
     currentBlock.previousHash = previousBlock.previousHash;
     currentBlock.hash = this.generateBlockHashPattern(currentBlock);
     return currentBlock;	  
  }
  
  recoverPreviousBlock(list){
    return list[list.length - 1]; 
  }
  
  generateBlockHashPattern(block){
  const secretPatterns = ['secretOne','secretTwo'];
  const hashType = 'sha-256';	  
  const RandomSecret = secretPatterns.indexOf(Math.floor(Math.random()*secretPatterns.length));	  
  const hash = crypto.createHmac(hashType,secretPatterns[RandomSecret]).update(block.blockKeyData).digest('hex');  console.log(hash)
  }
}

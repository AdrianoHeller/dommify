class Block{
  constructor(){
    this.hash = ''
    this.nonce = 0
    this.previousHash = ''
    this.position = 0
    this.transactions = []	  
}
   
  get blockKeyData(){
    return JSON.stringify(this.transactions) + this.nonce + this.hash + this.previousHash + this.position
  }

  pushTransaction(transaction){
    this.transactions.push(transaction)
  }
}

const mapTransactionData = (list,callback) => {
	const listMapped = []
	for(let i = 0 ; i < list.length ; i++){
	          item = list[i];	
		for(let j = 0; j < item.length; j++){
		  item[j] = callback(item[j],j);	
		  listMapped.push(item[j]);
		}
	}
	return listMapped 
}

module.exports = {
	Block,
	mapTransactionData
}

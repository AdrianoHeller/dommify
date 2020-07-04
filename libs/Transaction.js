class Transaction{
  constructor(from,to,amount){
    this.from = from || ''
    this.to = to || ''
    this.amount = amount || 0	  
  }
}

module.exports = Transaction

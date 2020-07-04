

class newUser{
   constructor(name,url,signer,tester,treatOptions){
	this.name = name || ''
	this.url = url || ''
	this.signer = false
	this.tester = false
	this.treatOptions = []   
   }
   
   get userData(){
     return{
	     name: this.name,
   	     url: this.url,
	     signer: this.signer,
	     tester: this.tester,
             options: this.treatOptions
     }   
   }
}

module.exports = newUser;

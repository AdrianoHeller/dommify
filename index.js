const { Block,mapTransactionData } = require('./libs/Block');
const Blockchain = require('./libs/Blockchain');
const Transaction = require('./libs/Transaction');
const User = require('./libs/User');

const http = require('http');
const {StringDecoder} = require('string_decoder');
const url = require('url');
const patterns = {
	decoder: 'utf-8',
	httpPort: 3000,
	httpsPort: 5000,
	parser: payload => {
	  try{
	    payload = typeof payload !== 'undefined' ? JSON.parse(payload): false;
	   return payload;	  
	  }catch(e){
	    return {}
	  }
	},
	generateToken: size => {
	  typeof size === 'number' && size > 0 ? size : false;
	  const possibleChosenChars = 'abcdefghijklmnopqrstuvwxyz0123456789';	
	  let stringToken = new String;
	  for(let i = 0 ; i < size; i++){
	  	const randomChar = possibleChosenChars.charAt(Math.floor(Math.random()*possibleChosenChars.length));
		stringToken += randomChar;  
	  }
	    return stringToken
	}
}

const servidorHTTP = http.createServer((req,res) => {
	// Parsing and Treating Query String
	const {parse} = url;
	const pathInit = parse(req.url,true).pathname;
	const pathTreated = pathInit.replace(/^\/+|\/+$/g,'');
	const {headers,method} = req;
	const {query} = parse(req.url,true);
	
	//Decoding the Streams
	const Decoder = new StringDecoder(patterns.decoder);
	//Appending the Data
	let bufferStringData = new String;

	//Listening the Events
	req.on('data', streamData => {
	  bufferStringData += Decoder['write'](streamData);
	});
	req.on('end', () => {
	  bufferStringData += Decoder['end']();
	  const payloadReq = {
	    params: query,
	    method,
	    headers,
	    path: pathTreated,	  
	    body: bufferStringData		  
	  };
	  const routingSender = typeof router[pathTreated] !== 'undefined' ? router[pathTreated] : router['notFound'];	
	  routingSender(payloadReq,res)
	});
});

servidorHTTP.listen(process.env.PORT || patterns.httpPort, err => {
	if(!err) console.log(`Servidor ouvindo na porta ${process.env.PORT || patterns.httpPort}`);
});

const router = {
  ping: (payloadReq,res) => {
    res.setHeader('Content-Type','application/json');
    if(payloadReq.body){
    	const parsedBody = patterns.parser(payloadReq.body);
	delete payloadReq.body;
	payloadReq.body = parsedBody;
	payloadReq.token = patterns.generateToken(30);    
	res.writeHead(200);
    	res.end(JSON.stringify(payloadReq));
    }else{
    	res.writeHead(400);
	res.end();    
    }
  },
  sendInfo: (payloadReq,res) => {
    res.setHeader('Content-Type','application-json');
    payloadReq.method === 'POST' ? (
      parsedBody = patterns.parser(payloadReq.body),
      delete payloadReq.body,
      payloadReq.body = parsedBody,
      payloadReq.token = patterns.generateToken(30),
      res.writeHead(200),
      res.end(JSON.stringify(payloadReq))	    
    ) : (
      res.writeHead(405),
      res.end()	    
    )
  },	
  minerate: (payloadReq,res) => {
    res.setHeader('Content-Type','application/json');
    const parsedBody = patterns.parser(payloadReq.body);
    let { name,url,signer,tester,treatOptions } = parsedBody;
    name = typeof name === 'string' && name.length > 0 ? name : false;
    url = typeof url === 'string' && url.length > 0 ? url : false;
    signer = typeof signer === 'boolean' ? signer : false;
    tester = typeof tester === 'tester' ? tester : false;
    treatOptions = typeof treatOptions === 'object' ? treatOptions : false;
	    payloadReq.method !== 'POST' ? (
	    res.writeHead(405),
	    res.end()	    
	    ):( name && url && treatOptions ? (
	    client = new User(name,url,signer,tester,treatOptions),
	    client.signer = signer,
	    client.tester = tester,
	    client.treatOptions = treatOptions,
	    res.writeHead(200),
	    res.end(JSON.stringify(client))
	    ) : (
	    res.writeHead(400),
	    res.end(JSON.stringify({"Error":"Missing Required Fields"}))
	      )
	    )
  },
  blockchain: (payloadReq,res) => {
    res.setHeader('Content-Type','application/json');
    payloadReq.method === 'GET' ? (
    parsedBody = patterns.parser(payloadReq.body),
    delete payloadReq.body,
    payloadReq.body = parsedBody,    	    
    res.writeHead(200),
    res.end()
    ):(
    res.writeHead(405),
    res.end()	    
    )
  },	
	
  notFound: (payloadReq,res) => {
    res.setHeader('Content-Type','application/json');
    res.writeHead(404);
    res.end();	  
  }
}


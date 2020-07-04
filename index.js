const { Block,mapTransactionData } = require('./libs/Block');
const Blockchain = require('./libs/Blockchain');
const Transaction = require('./libs/Transaction');

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
  minerate: (payloadReq,res) => {
    res.setHeader('Content-Type','application/json');
    res.writeHead(200);
    res.end();    
  },
  blockchain: (payloadReq,res) => {
    res.setHeader('Content-Type','application/json');
    res.writeHead(200);
    res.end();    
  },	
	
  notFound: (payloadReq,res) => {
    res.setHeader('Content-Type','application/json');
    res.writeHead(404);
    res.end();	  
  }
}

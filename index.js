const fs = require('fs');
const http = require('http');
const url = require('url');

///////////////////////////////
/*
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn} \n
created on ${Date.now}`;

fs.writeFileSync('./txt/output.txt', textOut);
*/
///////////FILES
/*
fs.readFile('./txt/start.txt', 'utf-8', (err, data) =>  {
    fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2) =>  {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) =>  {
            console.log(data3);
            
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
                fs.readFile('./txt/final.txt', 'utf-8', (err, data4) => {
                    console.log(data4);
                })
            })
            })
    })
});

*/

//////////////////// SERVER ///////////////

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template_card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    const replaceTemplate = (temp, product) => {
        let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);

        if(!product.organic){
            console.log('hello');
            output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

        };

        output = output.replace(/{%IMAGE%}/g, product.image);
        output = output.replace(/{%PRICE%}/g, product.price);
        output = output.replace(/{%NUTRIANTS%}/g, product.nutrients);
        output = output.replace(/{%QUANTITY%}/g, product.quantity);
        output = output.replace(/{%DESCRIPTION%}/g, product.description);
        output = output.replace(/{%ID%}/g, product.id);
        output = output.replace(/{%FROM%}/g, product.from);
        
        
        return output;
    };
// the /---/g makes it so it targets the placeholder globally and replaces all of them.
    //test
    
    //test

    const pathName = req.url;
    //OVERVIEW PAGE
    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
        
        res.end(output);


    }
    //PRODUCT PAGE
    else if (pathName === '/product'){
        res.end('this is the product');
    } 
    //API
    else if (pathName === '/api'){
        res.end(data);
    } 
    //NOF
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to Requests');
});


const http=require('http');
const fs=require('fs');
const url=require('url');

const template_card=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const template_product=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const template_overview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);
// console.log(data);

const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCT_NAME%}/g,product.productName);
    output=output.replace(/{%ID%}/g,product.id);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);

    if(!product.organic)
        output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
};

const server=http.createServer((req,res)=>{
    
    // const pathName=req.url;
    const { query,pathname }=url.parse(req.url,true);
    // console.log(query,pathname);
    
    //overview pages
    if(pathname==='/' || pathname==='/overview'){      
        res.writeHead(200,{'content-type':'text/html'});
        const cardsHtml=dataObj.map(element=> replaceTemplate(template_card,element)).join('');
        const output=template_overview.replace(/{%PRODUCT_CARDS%}/g,cardsHtml);
        res.end(output);
    //product pages    
    } else if(pathname=== '/product'){
        res.writeHead(200,{'content-type':'text/html'});
        const product=dataObj[query.id];
        // console.log(product);
        const output=replaceTemplate(template_product,product);        
        res.end(output);
    //API
    } else if(pathname=== '/api'){

    }else{
        res.end('<h1>Page Not Found!!!</h1>');
    }

});

server.listen(8000,()=>{
    console.log("server is running on port 8000...");
});
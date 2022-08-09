var model = require('../models/catalog');
var xlsx = require('node-xlsx').default;

module.exports.find = function(req, res) {
    const {search} = req.query;

    let filter = {};
    if(search) {
        filter = { $or: [
            {name: {'$regex': search, '$options': 'i'}}, 
            {'products': {$elemMatch: {'product_number': {'$regex': search, '$options': 'i'}}}}
        ]}
    }

    model.Catalog.find(filter, (err, docs) => {
        console.log('Error', err);
        console.log('Doc', docs);
        res.send(docs);
    });
};

module.exports.import = function(req, res) {
    console.log('Received');
    const fileName = `${process.cwd()}/Catalog.xlsx`;

    console.log('Reading: ' + fileName);
    const data = xlsx.parse(fileName);
    
    let models = {};
    if(data && data.length > 0) {
        // Read data, leave the first row, as it is heading.
        const sheet = data[0].data;
        const READ_POINTER = {
            ProductName: 1,
            ImageUrl: 2,
            Catalog: 0, 
            Catagories: 3, 
            ProductNumber: 4
        }

        for(idx = 1; idx < sheet.length; idx++) {
            const item = sheet[idx];
            if(item.length < Object.keys(READ_POINTER).length) {
                console.log('No No');
                continue;
            }

            console.log(item.length, item);
            let prodName = item[READ_POINTER.ProductName].trim();
            let metadata = [];

            for(let i = Object.keys(READ_POINTER).length; i < item.length; i+=2) {
                metadata.push({
                    name: item[i],
                    value: (i < item.length-1) ? item[i+1] : ''
                });
            }

            if(!models[prodName.toUpperCase()]) {
                models[prodName.toUpperCase()] = {
                    name: prodName, 
                    image_url: item[READ_POINTER.ImageUrl], 
                    catalog: item[READ_POINTER.Catalog],
                    catagories: [item[READ_POINTER.Catagories]], 
                    products: [
                        {
                            product_number: item[READ_POINTER.ProductNumber], 
                            metadata
                        }
                    ]
                }
            } else {
                models[prodName.toUpperCase()].products.push({
                    product_number: item[READ_POINTER.ProductNumber], 
                    metadata
                })
            }
        }

        console.log('Models', JSON.stringify(models));
        var products = [];
        Object.keys(models).forEach((key, idx) => {
            console.log(key);
            products.push(models[key]);
        });

        model.Catalog.insertMany(products).then(function(){
            console.log("Data inserted")  // Success
            res.send(products);
        }).catch(function(error){
            res.status(400);     // Failure
            res.send(products);
        });

    } else {
        res.send('No Data Available to import!');
    }
}
const fs = require('fs');
const path = require('path');

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    };

    save() {
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile(p, (error, fileContent) => {
            let products = [];
            if (!error) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => { console.log(error); });
        });
    }

    static fetchAll(callback) {
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile(p, (error, fileContent) => {
            if (error) {
                callback([]);
            } else {
                callback(JSON.parse(fileContent));
            }
        });
    }
};
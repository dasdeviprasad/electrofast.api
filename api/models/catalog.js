var mongoose = require( 'mongoose' );

const metadataSchema = mongoose.Schema({
  name: String,
  value: String
});

const productSchema = mongoose.Schema({
  name: String,
  product_number: String,
  metadata: [metadataSchema]
});


const catalogSchema = mongoose.Schema({
  name: String,
  image_url: String,
  catalog: String,
  catagories: [String],
  products: [productSchema]
});

module.exports.Catalog = mongoose.model('Catalog', catalogSchema);
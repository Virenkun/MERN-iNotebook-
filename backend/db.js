const mongoose = require('mongoose')
const uri = "mongodb+srv://viren:IIThyd07@virenmongodb.3ldg7nz.mongodb.net/iNotebook"

const connectMongoose = () => {
    mongoose.connect(uri)
        .then(() => {
            console.log("MongoDB Connected")
        })
        .catch((error) => {
            console.log(error)
        })
}

module.exports = connectMongoose;
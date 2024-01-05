import {connect, mongo, set} from 'mongoose'


set('strictQuery', true)


const mongoConnect = () => {
    connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log(`Cannot connect to MongoDB: ${err}`)
    })
}



export default mongoConnect
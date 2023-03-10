const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/yelp-camp';
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // Your User Id
            author: '63fdc3521d476e50e247f361',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                'Lorem imsum dolor dolor nan dolar oh yes you gonna amet consectiret posibect organife futeowe generattion basicmiw foint ao toiw',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dmicjrxof/image/upload/v1677898889/YelpCamp/vydguaho7maarpuhxcjm.jpg',
                    filename: 'YelpCamp/vydguaho7maarpuhxcjm',
                },
            ],
        });
        await camp.save();
    }
};

seedDB().then(() => {
    db.close();
});

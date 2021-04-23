const User = require('../models/User');
const Client = require('../models/Client');
const seedData = require('./seeds.json');

const getUser = async () => {
	try {
		if (!process.argv[2]) {
			throw new Error(
				'To seed the database provide an email address for an existing user'
			);
		}
		const user = await User.findOne({ email: process.argv[2] });
		if (!user) {
			throw new Error('No matching user found!');
		}
		return user;
	} catch (error) {
		console.error(error);
	}
};

Client.deleteMany()
	.then(getUser)
	.then((user) => {
		const seedDataWithOwner = seedData.map((client) => {
			client.owner = user._id;
			return client;
		});
		return Client.insertMany(seedDataWithOwner);
	})
	.then(console.log)
	.then(console.error)
	.finally(() => {
		process.exit();
	});

const express = require('express');
const Client = require('../models/Client');
const {
	handleValidateId,
	handleRecordExists,
	handleValidateOwnership,
} = require('../middleware/custom_errors');
const { requireToken } = require('../middleware/auth');

const router = express.Router();

// INDEX
// GET api/clients
router.get('/', (req, res, next) => {
	Client.find()
		.populate('owner', 'email -_id')
		.then((clients) => res.json(clients))
		.catch(next);
});

// SHOW
// GET api/clients/5a7db6c74d55bc51bdf39793
router.get('/:id', handleValidateId, (req, res, next) => {
	Client.findById(req.params.id)
		.populate('owner')
		.then(handleRecordExists)
		.then((client) => {
			if (!client) {
				res.sendStatus(404);
			} else {
				res.json(client);
			}
		})
		.catch(next);
});

// CREATE
// POST api/clients
router.post('/', requireToken, (req, res, next) => {
	console.log(req.body);
	Client.create({ ...req.body, owner: req.user._id })
		.then((client) => res.status(201).json(client))
		.catch(next);
});

// UPDATE
// PUT api/clients/5a7db6c74d55bc51bdf39793
router.put('/:id', handleValidateId, (req, res, next) => {
	Client.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
	})
		.then(handleRecordExists)
		.then((client) => {
			if (!client) {
				res.sendStatus(404);
			} else {
				res.json(client);
			}
		})
		.catch(next);
});

// DESTROY
// DELETE api/clients/5a7db6c74d55bc51bdf39793
router.delete('/:id', handleValidateId, requireToken, (req, res, next) => {
	clientInformation
		.findById(req.params.id)
		.then(handleRecordExists)
		.then((client) => handleValidateOwnership(req, client))
		.then((client) => client.remove())
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
});

module.exports = router;

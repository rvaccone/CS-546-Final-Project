import { courts } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';

// Creates a new review for a court.
const create = async (courtID, name, rating, comment) => {};

// Gets all reviews on a court.
const getAll = async (courtID) => {};

// Gets a court by its id.
const get = async (id) => {};

// Updates a court review.
const update = async (id, courtID, name, location, numCourts, accessible, lat, long) => {};

// Removes a review on a court.
const remove = async (id) => {};

export { create, getAll, get, update, remove };

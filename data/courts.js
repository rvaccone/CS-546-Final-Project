import { courts } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validation.js';

// Creates a new court and logs it in the courts collection.
const create = async (courtID, name, location, numCourts, accessible, lat, long) => {};

// Gets all courts from the courts collection.
const getAll = async () => {};

// Gets a court by its id.
const get = async (courtID) => {};

// Updates a court by its id.
const update = async (courtID, name, location, numCourts, accessible, lat, long) => {};

// Removes a court by its id.
const remove = async (courtID) => {};

export { create, getAll, get, update, remove };

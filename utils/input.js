import xss from 'xss';

// Function to apply xss protection to every value in an object
const xssProtectObject = (obj) => {
	for (let key in obj) obj[key] = xss(obj[key]);
	return obj;
};

export { xssProtectObject };

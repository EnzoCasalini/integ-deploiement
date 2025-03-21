/**
 * Calculate the age of a person in years.
 *
 * @param {object} p - An objet representing a person, implementing a birth Date parameter.
 * @returns {number} The age in years of the person.
 */
export function calculateAge(p) {
	if (!p) throw new Error("missing param p");
	if (typeof p !== "object" || Array.isArray(p)) throw new Error("Parameter must be an object");
	if (!p.birth) throw new Error("Object must have a 'birth' property");
	if (!(p.birth instanceof Date) || isNaN(p.birth.getTime())) throw new Error("'birth' must be a valid Date");
	if (p.birth > new Date()) throw new Error("'birth' cannot be in the future");

	let dateDiff = new Date(Date.now() - p.birth.getTime());
	return Math.abs(dateDiff.getUTCFullYear() - 1970);
}

/**
 * @typedef {object} Player
 * @property {number} id
 * @property {string} name
 * @property {string} chitthiName
 * @property {unknown[]} cards
 * @property {number} score
 * @property {number} penalties
 * @property {number | null} reactionTime
 */

/**
 * @typedef {object} SetupDraftPlayer
 * @property {number} id
 * @property {string} name
 * @property {string} chitthiName
 */

/**
 * @typedef {object} SetupPlayerFieldErrors
 * @property {string} [name]
 * @property {string} [chitthiName]
 */

/**
 * @typedef {object} SetupValidationResult
 * @property {boolean} isValid
 * @property {string[]} globalErrors
 * @property {Record<number, SetupPlayerFieldErrors>} playerErrors
 */

export {};

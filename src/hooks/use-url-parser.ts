/**
 * Encodes text to a readable and valid url string
 * 
 * @param {string} text - text
 * 
 * @returns {string}
 */
export const encodeStringToUrl = (text: string): string => encodeURI(text.toLocaleLowerCase().replaceAll(' ', '-'))

/**
 * Decodes a url string to normal text
 * 
 * @param {string} urlString - url string
 * 
 * @returns {string}
 */
export const decodeUrlToString = (urlString: string): string => decodeURI(urlString).replaceAll('-', ' ')
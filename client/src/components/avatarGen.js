/**
 * Generates a URL for an avatar with letters representing the name.
 *
 * @param {string} name - The name to generate the avatar for.
 * @param {HexColor string} (optional) backgroundColor - The background color of the avatar.
 * @param {HexColor string} (optional) color - The font color of the avatar.
 * @param {boolean} (optional) square - If true the avatar will be square insted of round.
 * @returns {string} The URL of the avatar with letters representing the name.
 */
const AvatarGen = ({ name, backgroundColor, color, square }) => {
  let rounded = true;
  if (!name) name = "john Doe";
  if (!backgroundColor) backgroundColor = "#645bff";
  if (!color) color = "#fff";
  if (square) rounded = false;
  backgroundColor = backgroundColor.replace("#", "%23");
  color = color.replace("#", "%23");
  return `https://ui-avatars.com/api/?name=${name}&background=${backgroundColor}&color=${color}&rounded=${rounded}`;
};
export default AvatarGen;

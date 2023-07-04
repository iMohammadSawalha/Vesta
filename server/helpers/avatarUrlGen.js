/**
 * Generates a URL for an avatar with letters representing the name.
 *
 * @param {string} name - The name to generate the avatar for.
 * @param {HexColor string} (optional) backgroundColor - The background color of the avatar.
 * @param {HexColor string} (optional) color - The font color of the avatar.
 * @param {boolean} (optional) square - If true the avatar will be square insted of round.
 * @returns {string} The URL of the avatar with letters representing the name.
 */
const avatarGen = ({ name, backgroundColor, color, square }) => {
  var bgColor,
    letters = "0123456789ABCDEF".split("");
  function AddDigitToColor(limit) {
    bgColor += letters[Math.round(Math.random() * limit)];
  }
  function GetRandomColor() {
    bgColor = "#";
    AddDigitToColor(5);
    for (var i = 0; i < 5; i++) {
      AddDigitToColor(15);
    }
    return bgColor;
  }
  let rounded = true;
  if (!name) name = "john Doe";
  if (!backgroundColor) backgroundColor = GetRandomColor();
  if (!color) color = "#fff";
  if (square) rounded = false;
  backgroundColor = backgroundColor.replace("#", "%23");
  color = color.replace("#", "%23");
  return `https://ui-avatars.com/api/?name=${name}&background=${backgroundColor}&color=${color}&rounded=${rounded}`;
};
module.exports = avatarGen;

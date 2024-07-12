const fs = require("fs");
const path = require("path");

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else if (file.endsWith(".js")) {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

module.exports = () => {
  const commandFiles = getAllFiles(path.join(__dirname, "../commands"));
  const commands = commandFiles.map((file) => require(file));
  return commands;
};

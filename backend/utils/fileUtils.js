const fs = require('fs');
const path = require('path');

function getData(type, res) {
  try {
    const dataPath = path.join(__dirname, '..', 'data', `${type}.json`);
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    res.status(500).send('Failed to read data');
  }
}

function saveData(type, data, res) {
  try {
    const dataPath = path.join(__dirname, '..', 'data', `${type}.json`);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    res.status(500).send('Failed to save data');
    return false;
  }
}

module.exports = { getData, saveData };
const fs = require('fs').promises;

const getData = async (entity, res) => {
  try {
    const filePath = `data/${entity}.json`;
    const data = await fs.readFile(__dirname + '/../' + filePath, 'utf8');
    console.log(data)
    return JSON.parse(data);
  } catch (error) {
    res.status(500).json({ message: `Erreur de lecture des ${entity}`,
      error: error.message });
    return null;
  }
};

const writeData = async (entity, data, res) => {
  try {
    const filePath = `data/${entity}.json`;
    await fs.writeFile(__dirname
      + '/../' + filePath, JSON.stringify(data), 'utf8');

    return true;

  } catch (error) {
    res.status(500).json({ message: `Erreur d'écriture des ${entity}`,
      error: error.message });
    return false;
  }
}

module.exports = { getData, writeData };

const fs = require('fs').promises;

const deleteImage = async (imagePath) => {

  try {
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    console.error('User image deleted')
  } catch (error) {
    console.error('User images not exist')
  }
}

module.exports = deleteImage
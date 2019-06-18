const fs = require('fs');
const path = require('path');

const packagesFolderPath = path.resolve(__dirname, 'packages');

const clearJSFilesFromFolder = (folderPath) => {
  fs.readdir(folderPath, (err, fileNames) => {
    if (err) {
      if (!err.message.includes('no such file or directory')) {
        console.info(`Error while getting lib/api directory fileNames: ${err.message}`);
      }
    } else {
      fileNames.forEach((itemName) => {
        const fullPath = `${folderPath}/${itemName}`;
        const extension = itemName.split('.')[1];
        if (!extension) {
          clearJSFilesFromFolder(fullPath);
        }

        if (extension === 'js' && itemName !== 'index.js') {
          try {
            fs.unlinkSync(fullPath);
          } catch (error) {
            console.info(`Can not delete file ${fullPath}: ${error.message}`);
          }
        }
      });
    }
  });
};

fs.readdir(packagesFolderPath, (err, fileNames) => {
  fileNames.forEach((packageName) => clearJSFilesFromFolder(`${packagesFolderPath}/${packageName}/lib/api`));
});

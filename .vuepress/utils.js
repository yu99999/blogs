const fs = require('fs');
const path = require('path');
const getFiles = (dirPath) => {
  // 获取指定文件夹下的所有文件，然后拼接上相对路径
  return fs.readdirSync(path.join(process.cwd(), dirPath)).map(item => `${dirPath}/${item}`)
}

const createSideBar = (title, dirPath, collapsable = true) => ({
  title,
  collapsable,
  children: getFiles(dirPath)
})

module.exports = {
  createSideBar
};
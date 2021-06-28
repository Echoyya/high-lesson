const options = {
  'port':{
    option:'-p, --port <n>', // 根据commander的option('')
    default: 8080,
    usage:'mhs --port 3000',
    description:'set mhs port'
  },
  'gizp':{
    option:'-g, --gizp <n>', 
    default: 1,
    usage:'mhs --gizp 0',  // 禁用压缩
    description:'set mhs gizp'
  },
  'cache':{
    option:'-c, --cache <n>', 
    default: 1,
    usage:'mhs --cache 0',  // 禁用缓存
    description:'set mhs cache'
  },
  'directory':{
    option:'-d, --directory <d>', 
    default: process.cwd(),    // 表示当前的工作目录
    usage:'mhs --directory C:',  
    description:'set mhs directory' // 设置服务启动目录
  }
}

module.exports = options

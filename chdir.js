// 变更Node.js进程的当前工作目录。 相当于修改本地文件对node_module的相对路径
// process.chdir("./groot-front");
// process.cwd();
// "node ./groot-front/node_modules/@vue/cli-service/bin/vue-cli-service.js serve"
const { exec } = require("child_process");
exec("cd ./groot-front", function(error, stdout, stderr) {
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
  exec("npm run dev", function(error, stdout, stderr) {
    console.log(`dev stdout: ${stdout}`);
    console.error(`dev stderr: ${stderr}`);
  });
});

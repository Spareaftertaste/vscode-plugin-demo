const vscode = require("vscode");
const util = require("./util");

/**
 * 自动提示实现，这里模拟一个很简单的操作
 * 当输入 this.dependencies.xxx时自动把package.json中的依赖带出来
 * 当然这个例子没啥实际意义，仅仅是为了演示如何实现功能
 * @param {*} document
 * @param {*} position
 * @param {*} token
 * @param {*} context
 */
function provideCompletionItems(document, position, token, context) {
  try {
    const line = document.lineAt(position);
    const projectPath = util.getProjectPath(document);
    
    // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);

    console.log(lineText, "咩阿阿阿阿阿");

    // 简单匹配，只要当前光标前的字符串为`this.dependencies.`都自动带出所有的依赖
    if (/(^|=| )\w+\.lang\.$/g.test(lineText)) {
      const currentFile = (document.uri ? document.uri : document).path;
      const arr = currentFile.split("/").filter((li) => li);
      //先默认只有一个pages 文件夹
      const pagesIndex = arr.indexOf("pages");
      let langJsonPath = "/locale/zh_CN.json";

      /*window 上面盘符占一个位置，
      然后需要定位到模块，而模块都是在src下面，这里默认只有pages 文件夹
      TODO 需要调整
      */
      langJsonPath = arr.slice(0, pagesIndex + 2).join("/") + langJsonPath;
      // for (let i = 0; i < pagesIndex-3; i++) {
      //   langJsonPath = "../" + langJsonPath
      // }

      // const json = require("e:/react-demo/src/pages/id_auth/locale/zh_CN.json");
      const json = require(langJsonPath);
      const langKeys = Object.keys(json || {});

      // const dependencies = Object.keys(json.dependencies || {}).concat(
      //   Object.keys(json.devDependencies || {})
      // );
      return langKeys.map((langKey) => {
        // vscode.CompletionItemKind 表示提示的类型
        return new vscode.CompletionItem(
          `${langKey}: ${json[langKey]}`,
          vscode.CompletionItemKind.Field
        );
      });
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item
 * @param {*} token
 */
function resolveCompletionItem(item, token) {
  return null;
}

module.exports = function (context) {
  // 注册代码建议提示，只有当按下“.”时才触发
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "javascript",
      {
        provideCompletionItems,
        resolveCompletionItem,
      },
      "."
    ),
    vscode.commands.registerCommand("extension.lang", () => {
      // vscode.window.showInformationMessage("多语言自动补全");
      // vscode.TextEdit.
    })
  );
};

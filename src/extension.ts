import * as vscode from 'vscode';

/** 判断数据是不是对象类型 */
const isObject = (data: any): boolean => {
  return data && `${Object.prototype.toString.call(data)}`.includes('Object');
};

const toObject = (data: any): object => {
  return isObject(data) ? data : {};
};

/**
 * 读取工作区配置项
 * @param section 配置项路径（如 "editor.fontSize"）
 */
function getWorkspaceSetting(section = 'commandRunVscode') {
  return vscode.workspace.getConfiguration(section);
}

/** 连接的客户端 */
let statusBarItem: vscode.StatusBarItem;
const statusBarItemText = '$(play)';

const openTerminal = (command: string) => {
  // 获取当前第一个工作区文件夹
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('请先打开一个工作区文件夹！');
    return;
  }

  // 1.新建终端，cwd 设置为工作区根目录
  const terminal = vscode.window.createTerminal({
    // name: 'command-run-vscode', // 终端标签名称
    // cwd: workspaceFolder.uri.fsPath, // 工作区根路径！关键
    // shellPath:"powershell.exe" // windows可选指定shell
  });

  // 2.显示终端面板
  terminal.show();

  // 3.发送命令执行，默认自动回车执行
  terminal.sendText(command);
};

const runCommand = async () => {
  const res = getWorkspaceSetting();
  // 获取字符串配置值，第二个参数是兜底默认值
  const runCommand: string = res.get<string>('command', 'npm run dev');
  if (runCommand) {
    openTerminal(runCommand);
  } else {
    vscode.window.showErrorMessage('请先默认命令配置！');
  }
};

const drawTooltip = () => {
  const res = getWorkspaceSetting();
  const command: string = res.get<string>('command', 'npm run dev');
  const t1: string[] = [];
  if (command) {
    t1.push(command, '---');
  }
  // 获取字符串配置值，第二个参数是兜底默认值
  const commandList = [...t1, res.get<string[]>('commandList', [])]
    .map((el) => `${el || ''}`.trim())
    .filter((item) => item);

  // console.log('commandList', commandList);

  const t = commandList.map((el) => {
    if (el === '---') {
      return el;
    }
    return `- [$(play) ${el}](command:command-run-vscode.runTooltip?${encodeURIComponent(
      JSON.stringify({ command: el }),
    )})`;
  });

  const tooltip = new vscode.MarkdownString(
    `
  ## command-run-vscode [$(refresh)](command:command-run-vscode.refreshTooltip)
  ---
  ${t.join('\n')}
  `,
    true,
  );
  tooltip.isTrusted = true;
  statusBarItem.tooltip = tooltip;
  statusBarItem.hide();
  statusBarItem.show();
};

export async function activate(context: vscode.ExtensionContext) {
  // ========== 1. 创建状态栏项 ==========
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, // 位置：右侧（Left 为左侧）
    0, // 优先级（数值越大越靠右/左）
  );

  // ========== 2. 配置状态栏样式和内容 ==========
  statusBarItem.text = statusBarItemText;
  drawTooltip();

  statusBarItem.command = 'command-run-vscode.clickStatusBar'; // 点击触发的命令

  // ========== 3. 显示状态栏 ==========
  statusBarItem.show();

  const clickDisposable = vscode.commands.registerCommand('command-run-vscode.clickStatusBar', () => {
    // 弹出带命令的快速选择菜单
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = 'command-run-vscode';

    const res = getWorkspaceSetting();
    const command: string = res.get<string>('command', 'npm run dev');

    // 获取字符串配置值，第二个参数是兜底默认值
    const commandList = [command, res.get<string[]>('commandList', [])]
      .map((el) => `${el || ''}`.trim())
      .filter((item) => item && item !== '---');

    /** 更新快速选择菜单项 */
    const updateItems = () => {
      quickPick.items = commandList.map((el) => ({
        // 使用 主题 图标
        iconPath: new vscode.ThemeIcon('play'),
        label: el,
        // detail: el.fsPath,
        // buttons: [
        //   // { iconPath: new vscode.ThemeIcon('play'), tooltip: '运行' },
        //   { iconPath: new vscode.ThemeIcon('close'), tooltip: '删除记录' },
        // ],
      }));
    };
    updateItems();

    // 标签栏添加按钮
    // quickPick.buttons = [{ iconPath: new vscode.ThemeIcon('refresh'), tooltip: '刷新' }];
    // quickPick.onDidTriggerButton(async (button) => {
    //   // console.log(button);
    //   clearRecentFiles();
    //   updateItems();
    // });

    // quickPick.onDidTriggerItemButton((button) => {
    //   // console.log('onDidTriggerItemButton', button);
    //   if (button.button.tooltip === '删除记录') {
    //     const fsPath = button.item.description;
    //     if (fsPath && typeof fsPath === 'string') {
    //       removeRecentFiles(fsPath);
    //       updateItems();
    //     }
    //   }
    // });

    quickPick.onDidChangeSelection(async (selection) => {
      if (selection[0]) {
        const label = selection[0].label;
        openTerminal(label);
        quickPick.dispose();
      }
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  });

  // ========== 4. 注册状态栏点击的自定义命令 ==========
  const refreshCommand = vscode.commands.registerCommand('command-run-vscode.run', async () => {
    runCommand();
    // 点击事件逻辑：刷新组件缓存
    // await vscode.window.withProgress(
    //   { location: vscode.ProgressLocation.Notification, title: '正在运行命令...' },
    //   async () => {
    //     try {
    //       await runCommand();
    //     } catch (error) {}
    //   },
    // );
  });

  // 刷新命令列表
  const refreshTooltip = vscode.commands.registerCommand('command-run-vscode.refreshTooltip', async () => {
    drawTooltip();
  });

  // 运行命令列表命令
  const runTooltip = vscode.commands.registerCommand('command-run-vscode.runTooltip', async (arg) => {
    // console.log('runTooltip', arg);
    openTerminal(arg.command);
  });

  // 监听配置文件变化
  const changeConfig = vscode.workspace.onDidChangeConfiguration(async (e) => {
    if (e.affectsConfiguration('commandRunVscode.commandList') || e.affectsConfiguration('commandRunVscode.command')) {
      drawTooltip();
    }
  });

  context.subscriptions.push(refreshCommand, refreshTooltip, runTooltip, changeConfig, clickDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

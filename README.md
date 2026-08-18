# 自定义运行命令 vscode 插件

## 工作区 .vscode 目录下 settings.json 配置

### npm 例子

```json
// 默认运行命令
"commandRunVscode.command": "npm run dev",
// 自定义运行命令
"commandRunVscode.commandList": ["npm run build"]
```

### flutter 例子

```json
// 默认运行命令
"commandRunVscode.command": "flutter run",
// 自定义运行命令
"commandRunVscode.commandList": ["flutter build windows","flutter clean"]
```

- 编辑器右上角图标图标, 运行默认命令
- 状态栏图标, 点击弹出 QuickPick 或者 hover 显示 tooltip, 运行命令

## npm 常用命令

### 初始化项目，生成 package.json

`npm init`

`npm init -y`

### 安装所有包

`npm i`

`pnpm i`

### 更新所有包

`npm update`

### 查看本地已安装包

`npm ls` 查看本地已安装包列表

`npm ls -g` 全局包列表

### 运行 scripts 里的命令

`npm run xxx`

### 最常见

`npm run dev` 启动开发环境

`npm run build` 打包生产代码

`npm run serve` 预览打包产物

`npm start` 快捷脚本，可不用 run

## flutter 常用命令

### 运行项目（自动找第一个设备）

`flutter run`

### debug 默认，热重载，开发调试

`flutter run`

### profile 性能分析模式，release性能，可看性能面板

`flutter run --profile`

### release 正式发布模式，关闭调试、性能最好，不能断点调试

`flutter run --release`

### 指定设备运行，先查设备id

`flutter devices`

### web调试运行

`flutter run -d chrome`

### chrome端口号，允许跨设备访问

`flutter run -d chrome --web-port 5500`

### web‑release打包运行

`flutter run -d chrome --release`

### Windows / Mac / Linux 桌面

`flutter run -d windows`

`flutter run -d macos`

`flutter run -d linux`

### 指定运行主入口文件

`flutter run -t lib/main.dart`

### 指定启动 flavor(多环境)

`flutter run --flavor dev`

### 指定dart环境变量

`flutter run --dart-define=ENV=dev`

### 检查现有环境

`flutter doctor -v`

### 创建项目

`flutter create my_app`

### 为已有的应用添加各平台支持

`flutter create --platforms=windows,macos,linux,android,ios .`

### 升级SDK

`flutter upgrade`

### 降级SDK

`flutter downgrade`

### 切换 Flutter 发布渠道 stable, beta and master

`flutter channel stable`

### 仅更新 packages

### - 下载所有依赖

`flutter pub get`

### - 所有依赖更新到 最新的兼容版本

`flutter pub upgrade`

### - 如果需要自动判断那些过时了的 package 依赖以及获取更新建议

`flutter pub outdated`

### 打包

### 获取2个APK s905x3 或s96max+

`flutter build apk --split-per-abi`

### 打包aab

`flutter build appbundle`

### 减少应用大小 --split-debug-info

### 32位

`flutter build apk --target-platform=android-arm`

### 64位

`flutter build apk --target-platform=android-arm64`

`flutter build windows`

`flutter build macos`

`flutter build linux`

`flutter build web`

`flutter build web --wasm`

### 清理项目

`flutter clean`

### 查看依赖树

`flutter pub deps`

## 其他

### vscode 插件打包

`vsce package `

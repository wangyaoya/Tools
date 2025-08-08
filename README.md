# VPN Tool - 龙湖余量查询工具

> 一个用于查询龙湖小区用电余额的自动化工具，**完美支持 Loon**，同时兼容 Surge、QuantumultX 等平台

[![GitHub stars](https://img.shields.io/github/stars/wangyaoya/vpn_tool)](https://github.com/wangyaoya/vpn_tool/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/wangyaoya/vpn_tool)](https://github.com/wangyaoya/vpn_tool/network)
[![GitHub issues](https://img.shields.io/github/issues/wangyaoya/vpn_tool)](https://github.com/wangyaoya/vpn_tool/issues)
[![GitHub license](https://img.shields.io/github/license/wangyaoya/vpn_tool)](https://github.com/wangyaoya/vpn_tool/blob/master/LICENSE)
[![Loon Support](https://img.shields.io/badge/Loon-✅%20Supported-brightgreen)](https://github.com/Arkon/Loon)

## 📋 项目概述

VPN Tool 是一个专门为龙湖小区居民设计的用电余额查询工具。通过自动化脚本，用户可以实时查询用电余额，并在余额不足时收到及时提醒，避免因欠费而断电。

### ✨ 主要功能

- 🔍 **实时余额查询** - 自动查询龙湖小区用电余额
- ⚠️ **智能提醒** - 余额不足时自动发送通知
- 🔧 **多平台支持** - 兼容 Loon、Surge、QuantumultX 等
- 📱 **便捷配置** - 简单的参数配置，即开即用
- 🔄 **定时执行** - 支持定时任务，自动监控

## 🚀 快速开始

### 🎯 Loon 用户（推荐）

**一键导入插件：**
```
https://raw.githubusercontent.com/wangyaoya/vpn_tool/master/Loon/plugin/longHu/queryLongHuBalance.plugin
```

**手动导入步骤：**
1. 打开 Loon 应用
2. 进入 `插件` 页面
3. 点击右上角 `+` 号
4. 选择 `插件` 类型
5. 粘贴上述链接并导入


## ⚙️ 配置说明

### 必需参数

| 参数名 | 说明 | 示例 | 获取方式 |
|--------|------|------|----------|
| `WXOpenId` | 微信 OpenID（必需） | `wx_1234567890abcdef` | 抓包获取 |
| `alarmbalance` | 报警阈值（可选，默认11） | `15` | 自定义设置 |
| `MeterID` | 电表ID（可选） | `meter_001` | 物业获取 |

### 🔧 Loon 配置详解

#### 1. 获取 WXOpenId

**方法一：抓包获取**
1. 使用 Loon 的抓包功能
2. 访问龙湖小区微信小程序
3. 在请求中找到包含 OpenID 的请求
4. 复制 OpenID 值

**方法二：联系物业**
- 直接联系小区物业获取您的 OpenID

#### 2. 配置插件参数

在 Loon 中配置插件参数：
1. 导入插件后，点击插件名称
2. 在 `参数` 部分添加：
   ```
   WXOpenId = your_open_id_here
   alarmbalance = 15
   MeterID = your_meter_id (可选)
   ```

#### 3. 启用定时任务

插件默认配置了定时任务：
- **执行频率**: 每 10 分钟
- **执行时间**: 全天候监控
- **通知方式**: Loon 内置通知

## 📱 支持平台

| 平台 | 状态 | 安装方式 | 特色功能 |
|------|------|----------|----------|
| **Loon** | ✅ **完美支持** | 插件导入 | 🎯 原生插件支持 |

### 🎯 Loon 专属优势

- **原生插件支持** - 无需额外配置
- **图形化界面** - 参数配置更直观
- **内置通知** - 系统级通知推送
- **定时任务** - 自动执行，无需手动
- **日志查看** - 详细的操作日志

## 🏗️ 项目结构

```
vpn_tool/
├── Loon/                          # 🎯 Loon 专用文件
│   ├── plugin/
│   │   └── longHu/
│   │       ├── queryLongHuBalance.plugin    # Loon 插件文件
│   │       └── selectLongHuBalance.js       # 核心脚本
│   └── icon/
│       └── longhu.jpg                        # 插件图标
└── README.md
```

## 🔧 技术特性

### 重构优化
- ✅ **模块化设计** - 清晰的代码结构
- ✅ **配置集中化** - 统一管理所有配置项
- ✅ **错误处理增强** - 完善的异常处理机制
- ✅ **代码可读性** - 详细的注释和文档

### 核心功能
- 🔍 **智能查询** - 自动构建请求参数
- 📊 **数据解析** - 准确解析 API 响应
- 🔔 **通知系统** - 多渠道消息推送
- 📝 **日志记录** - 详细的操作日志

## 📖 使用教程

### 🎯 Loon 用户专用教程

#### 1. 安装插件

1. 打开 Loon 应用
2. 进入 `插件` 页面
3. 点击右上角 `+` 号
4. 选择 `插件` 类型
5. 输入插件链接：
   ```
   https://raw.githubusercontent.com/wangyaoya/vpn_tool/master/Loon/plugin/longHu/queryLongHuBalance.plugin
   ```
6. 点击 `保存`

#### 2. 配置参数

1. 点击已导入的插件名称
2. 在 `参数` 部分添加：
   ```
   WXOpenId = your_open_id_here
   alarmbalance = 15
   MeterID = your_meter_id (可选)
   ```
3. 点击 `保存`

#### 3. 启用插件

1. 在插件列表中启用该插件
2. 插件会自动开始执行定时任务
3. 可在 `日志` 页面查看运行状态

#### 4. 测试运行

1. 手动点击插件名称执行一次
2. 查看日志输出确认运行正常
3. 检查是否收到通知消息

### 其他平台用户

#### 1. 安装配置

1. 在您的代理工具中导入对应平台的脚本
2. 配置必要的参数（WXOpenId 等）
3. 启用定时任务（建议每 10 分钟）

#### 2. 参数配置

```javascript
// 在脚本中配置以下参数
const WXOpenId = "your_wx_open_id";        // 必需
const alarmBalance = 15;                    // 可选，默认11
const MeterID = "your_meter_id";           // 可选
```

#### 3. 运行测试

配置完成后，脚本会自动：
1. 验证参数有效性
2. 发送查询请求
3. 解析响应数据
4. 显示余额信息
5. 发送提醒通知（如需要）

## 🐛 故障排除

### 常见问题

**Q: Loon 插件导入失败**
A: 请检查网络连接，确保可以访问 GitHub

**Q: 提示 "WXOpenId未配置"**
A: 请在插件参数中正确配置 WXOpenId

**Q: 查询失败，网络异常**
A: 请检查网络连接和 API 地址是否正确

**Q: 解析数据失败**
A: 可能是 API 响应格式变化，请联系开发者

**Q: 没有收到通知**
A: 请检查 Loon 的通知权限设置

### 调试方法

1. 查看 Loon 的日志输出
2. 检查网络请求是否成功
3. 验证参数配置是否正确
4. 确认插件是否已启用

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 贡献方式

1. Fork 本仓库
2. 创建功能分支
3. 提交代码更改
4. 发起 Pull Request

### 开发环境

- Node.js >= 14
- 支持 ES6+ 语法
- 遵循代码规范

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

感谢以下开源项目：
- [Loon](https://github.com/Arkon/Loon) - 优秀的代理工具

## 📞 联系方式

- **GitHub Issues**: [提交问题](https://github.com/wangyaoya/vpn_tool/issues)
- **邮箱**: [联系邮箱]
- **QQ群**: [交流群号]

## ⭐ 支持项目

如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！

---

**最后更新**: 2025年8月  
**版本**: v2.0.0  
**状态**: ✅ 生产就绪 
# 🎯 Loon 插件集合 (Tools)

> 个人自用的 Loon 插件库，包含自动化查询、接口重写及体验优化工具。

[![Loon Support](https://img.shields.io/badge/Loon-✅%20Supported-brightgreen)](https://github.com/Arkon/Loon)
[![GitHub license](https://img.shields.io/github/license/wangyaoya/Tools)](https://github.com/wangyaoya/Tools/blob/master/LICENSE)

## 🚀 插件一键导入
点击下表中的链接，将通过 Loon 统一链接自动唤起 App 并识别地址：
| 插件名称 | 功能描述 | 一键导入 (Loon 官方跳转) |
| :--- | :--- | :--- |
| **龙湖余量查询** | 自动监控电费余额并提醒 | [📥 点击导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2Fwangyaoya%2FTools%2Fmaster%2FLoon%2FplugIn%2FlongHu%2FqueryLongHuBalance.plugin) |
| **联通白名单** | 自动修改白名单接口返回码 | [📥 点击导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2Fwangyaoya%2FTools%2Frefs%2Fheads%2Fmaster%2FLoon%2FplugIn%2FcommonRewrite%2Funicom_official_white.plugin) |
| **湖北移动SSO** | 优化个人主页/账单跳转逻辑 | [📥 点击导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2Fwangyaoya%2FTools%2Frefs%2Fheads%2Fmaster%2FLoon%2FplugIn%2FcommonRewrite%2Fhb10086_sso_jump.plugin) |
---

## ⚙️ 重点插件配置说明

### ⚡ 龙湖余量查询工具
专门为龙湖小区设计。导入插件后，请在 **[插件配置]** 界面填写以下参数：

1.  **必需参数**：
    *   `WXOpenId`: 微信小程序抓包获取。
2.  **可选参数**：
    *   `alarmbalance`: 报警阈值（默认为 11，当余额低于此值时通知）。
    *   `MeterID`: 特定电表 ID（可选）。

---

## 🛠️ 手动安装指南

如果您无法通过点击链接导入，请按照以下步骤操作：

1.  打开 **Loon** -> **插件** -> 点击右上角 `+`。
2.  复制下方对应的插件原始链接 (Raw URL)。
3.  选择 `插件` 模式，粘贴链接并保存。

**原始链接清单：**
- **龙湖查询**: `https://raw.githubusercontent.com/wangyaoya/Tools/master/Loon/plugin/longHu/queryLongHuBalance.plugin`
- **联通白名单**: `https://raw.githubusercontent.com/wangyaoya/Tools/refs/heads/master/Loon/plugIn/commonRewrite/unicom_official_white.plugin`
- **湖北移动SSO**: `https://raw.githubusercontent.com/wangyaoya/Tools/refs/heads/master/Loon/plugIn/commonRewrite/hb10086_sso_jump.plugin`

---

## 🏗️ 项目结构简述

```
Tools/
└── Loon/
    ├── plugIn/
    │   ├── longHu/           # 龙湖余量查询逻辑
    │   └── commonRewrite/    # 通用重写插件（联通、移动等）
    └── README.md
```

## 🐛 常见问题 (FAQ)

*   **Q: 提示 "WXOpenId 未配置"？**
    *   A: 请在 Loon 插件的“参数”设置中填入抓包获得的 `WXOpenId`。
*   **Q: 插件不生效？**
    *   A: 请确保 Loon 已开启 `MITM` 功能，并已安装并信任相关证书。

---

**最后更新**: 2026年1月
**Star 支持**: 如果觉得好用，请给个 ⭐ [Star](https://github.com/wangyaoya/Tools) 吧！

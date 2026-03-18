# 网站 WEBSITE

## 项目简介
WEBSITE是一个基于Vue + Node.js + Express + MySQL开发的家庭管理系统，提供用户认证、家庭管理、记事本等功能。

## 技术栈
- **前端**: Vue.js
- **后端**: Node.js + Express
- **数据库**: MySQL
- **认证**: JWT Token
- **测试**: 自定义测试框架
- **代码质量**: 自定义代码质量检查工具

## 版本信息
- 当前版本: 0.0.1
- 作者: Silin7

## 安装指南

### 环境要求
- Node.js >= 12.0.0
- MySQL >= 5.7.0

### 安装步骤
1. 克隆项目
```bash
git clone <repository-url>
cd website-node
```

2. 安装依赖
```bash
npm install
```
### 生产环境
```bash
# 使用PM2等进程管理工具
npm install -g pm2
npm run start
# 或使用PM2直接启动
npm install -g pm2
npm run start:prod
```
## 测试说明

### 运行单元测试
```bash
npm run test:unit
```

### 运行集成测试
```bash
npm run test:integration
```

### 运行所有测试
```bash
npm run test
```

## 代码质量检查
```bash
npm run lint
```
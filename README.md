<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 项目：nestjs_template
- 作者：zdhsoft
- 日期：2023-05-19
- 基于nestjs的后端系统
- License: 


## 1. Description

### 1.1 环境说明
- 这个工程默认使用vscode, 并已经集成了vscode运行所需要必要配置
- 这里使用eslint对代码进行检查 具体配置查看 .eslintrc.js 使用npm run lint对代码做整检查
- 这里使用prettier对代码进行格式化，具体配置看 .prettierrc  使用npm run format可以对整个项目代码格式化
- 这里需要这装插件：ESLint, 和 Prettier - Code formatter
- .gitigonore 这里配置了一些，可以忽略的文件，使他们不会进入git管理

### 1.2 配置
- 这里工程已经支持多环境配置，每个环境使用指定的配置。配置文件全在config目录下面
- 这里使用的配置是yaml格式的文件，文件名格式：env.环境名称.yaml，其中，env.default.yaml是一个全局的默认配置，实际环境的配置会替换env.default.yaml存在的配置
- 配置处理的代码，放在src/init/init.ts文件，在main.ts最开的包含中，要第一个引入这个模块
```typescript
// main.ts
import './init/init';   //在main.ts最上面，要引入这个模块
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getLogger } from 'xmcommon';
import { NestLogger } from './common/nest.logger';
import { RequestInterceptor } from './common/request.interceptor';
import { HttpFilterFilter } from './common/http_filter.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as path from 'path';
import { AuthGuard } from './common/auth.guard';
import { EnvUtils } from './env_utils';
import { ConfigUtils } from './init/config_utils';
import { ValidationPipe } from './common/validation_pipe';
```
- src/init/init.ts 首先会初会化全局的日志文件，然后初始化环境变量，最后加载对应的环境的配置文件
- 程序启动会，会在config/final生成最终的配置文件，分别是finalConfig.环境名称.json和finalConfig.环境名称.yaml

### 1.3 已经集成的模块功能
#### 1.3.1 session
- 这里已经集成了session,支持基于内存，文件，redis和mysql四种存放session的方式。（在实际测试使用中，发现使用文件存储的,老是会存在一些问题）
- 详见src/init/config_utils.ts中的buildSessionOptions
#### 1.3.2 log4js
- 这里已经集成了log4js生成日志，有三个输出分别是console，日志文件和错误日志文件
#### 1.3.3 这里集成了全局的守护的功能：auth.guards.ts
- 这个会对api做登录检查，有需要登录的，如果没有登录，返回没有登录的错误
#### 1.3.4 全局的验证管道: validation_pipe.ts
- 这个主要是针对class-validator和class-transformer的依赖参数注入，这方面的资料比较多，可以看官方文档
#### 1.3.5 全局的异常处理 http_filter.filter.ts
- 这个主要是将抛出的异常获取，并转换为通用的返回方式
#### 1.3.6 全局的返回处理 这块代码在全局的拦截器里面 request.interceptor.ts
- nestjs没有默认的固定返回结构，可以返回任何内容。这里专门针对api的调用，做统一返回处理
#### 1.3.7 全局的拦截器 request.interceptor.ts
- 这里主要的是处理POST 201的返回，将它变成为200，
- 增加请求处理前后的日志打印和耗时打印，用于调试
#### 1.3.7 集成swagger
- 在开发模式下，集成了  http://xxxx/apidoc方式访问

### 1.4 运行环境说明(envid)
#### 1.4.1 运行环境与配置
- 一般情况下，运行环境主要有两个，一个是测试运行环境，一个是生产运行环境，不同的环境要加载不同的配置
- 在这里启动的时候，需要指明envid，告诉系统这次运行的是什么环境。
  - 通过个envid可以加载config/env.xxx.ymal的配置文件
  - 如envid='test',则会加载config/env.test.yaml
  - 默认的envid是'local'，除此之外，还有一个缺省环境，对一些所有环境公有的配置，可以放到env.default.yaml中,  这样可以减少配置量。在实际的环境如果有同名的，则实际的配置会替换在default中的配置。
  - 如果程序启动，需要指定环境id,则只要传入参数就可以，如下启动'test'环境。
  ```bash
  node dist/main.js --envid test 
  ```
#### 1.4.2 增加自定义环境说明 
- 默认的工程，提供了四个默认环境与配置，分别是,default, test, local, production，这些环境都定义在EnumRuntimeEnv这个枚举中
- 枚举等运行环境相关配置放在文件，src/env_utils.ts中
```typescript
/** 可以环境常量定义 */
export enum EnumRuntimeEnv {
    /** 缺省配置环境 */
    default = 'default',
    /** 测试 */
    test = 'test',
    /** 本地调试环境 */
    local = 'local',
    /** 生产环境 */
    production = 'production',
}
```
- 如果要新增加运行环境，第一步先在EnumRuntimeEnv增加新的枚举值，第二步，在config/增加一个新的配置文件。下示是示例增加一个simple环境
```typescript
// 第一步： 在EnumRuntimeEnv增加simple枚举值的定义，要求名称与值相同
export enum EnumRuntimeEnv {
  /** 缺省配置环境 */
  default = 'default',
  /** 测试 */
  test = 'test',
  /** 本地调试环境 */
  local = 'local',
  /** 生产环境 */
  production = 'production',
  /** 新增加的环境 */
  simple = 'simple',
}

// 第二步：在config目录下，复制env.default.yaml，并改名为env.simple.yaml，
// 第三步：再用编辑器编译env.simple.yaml文件，配置simple实际需要的配置
// 第四步：启动的时候，带上启动参数： node dist/main.js --envid simple
// 这样就实现了新增环境要求
```
- 如果有些环境，是要视步生产环境的，则只需要将EenumRuntimeEnv.simple加到生产环境id列表中去就可以了，在src/env_utils.ts中有一个生产环境id数组：production_env_list。如下增加
```typescript
/** 被视为生产环境的环境id数组 */
const production_env_list = [EnumRuntimeEnv.production, EnumRuntimeEnv.simple];
// 系统启动后，就可以看到取得当前系统环境定义
/** 全局环境配置 */
const env: IEnv = {
  env: EnumRuntimeEnv.local,
  /** 是否是开发环境 */
  isDev: true,
};
// 使用的时候，在代码调用
if(XEnvUtils.isDev) {
  console.log('这是一个开发环境');
} else {
  console.log('这是一个生产环境');
}
```

## 2 安装依赖环境

```bash
$ npm install
```
## 3 运行app

### 3.1 在vscode下面
- 这个模板工程已经配置好了相应的vscode配置，可以在vscode下面，按F5开始调试运行
- 下面是配置的内容.
```json
{
    // 使用 IntelliSense 了解相关属性。
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "编译并运行 - 本地测试",
            "console": "integratedTerminal",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\dist\\main.js",
            "preLaunchTask": "npmBuild",
            "args": ["--env", "test"],
            "outFiles": [
                "${workspaceFolder}/dist/**/*.js"
            ]
        },
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "直接运行，不编译 - 本地测试",
            "console": "integratedTerminal",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\dist\\main.js",
            "args": ["--env", "test"],
            "outFiles": [
                "${workspaceFolder}/dist/**/*.js"
            ]
        }
    ]
}
```
#### 3.1.1 编译并运行 - 本地测试
这个是针对已有变动代码了，则需要在这里运行，这里会对代码做检查，并且编译，最后才是运行
#### 3.1.2 直接运行，不编译 - 本地测试
这个是没有变动代码，可以直接开始调试运行

### 3.2 命令行

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 4 Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 5 Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## 6 Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)


# 基于 docker 的 prisma + eggjs + typescript 的后端请求模板

## 一、拥有的能力

- [x] [prisma](https://www.prisma.io/docs/getting-started/quickstart): `ORM` 框架
- [x] [`eggjs`](https://www.eggjs.org/zh-CN/tutorials/typescript): 基于 Koa2 的企业级 node 框架
- [x] `mysql`: 默认使用 `mysql`, 也可一键切换成 `PostgreSQL` 、 `SQL Server`
- [x] jwt-token: 基于 `jsonwebtoken` + `koa-jwt`; 为什么不使用 egg-jwt? 因为此项目很久没人维护了
  - [x] 用户登录
  - [x] 基于 md5 的密码加密
  - [x] 用户注册
  - [x] 登录态校验
- [x] `docker`: 利用 docker 一键部署 应用
- [x] `redis`: 基于 [ioredis@v5](https://github.com/luin/ioredis) 的 redis 方案
- [ ] `swagger api doc`: 基于 `router` 注解的方式自动生成 api 请求文档;
- [ ] 微信
  - [x] [微信小程序 登录](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/others/WeChat_login.html)
  - [ ] 微信公众号
- [ ] `github` 登录鉴权

内置的插件:

- [onerror](https://github.com/eggjs/egg-onerror) 统一异常处理
- [Session](https://github.com/eggjs/egg-session) Session 实现
- [i18n](https://github.com/eggjs/egg-i18n) 多语言
- [watcher](https://github.com/eggjs/egg-watcher) 文件和文件夹监控
- [multipart](https://github.com/eggjs/egg-multipart) 文件流式上传
- [security](https://github.com/eggjs/egg-security) 安全
- [development](https://github.com/eggjs/egg-development) 开发环境配置
- [logrotator](https://github.com/eggjs/egg-logrotator) 日志切分
- [schedule](https://github.com/eggjs/egg-schedule) 定时任务
- [static](https://github.com/eggjs/egg-static) 静态服务器
- [jsonp](https://github.com/eggjs/egg-jsonp) jsonp 支持
- [view](https://github.com/eggjs/egg-view) 模板引擎

## 二、如何使用

### 安装模板

```bash


```

### 安装依赖

```bash
# 安装依赖
npm i
# 启动项目
npm run dev
```

## 项目配置

### 1. 配置数据库 及 使用

```bash
# .env

# 记得更换成自己的用户名+密码+数据库
DATABASE_URL="mysql://root:my-secret-pw@localhost:3307/node_template"

```

同步数据库+基础表

```bash
npm run db:c
```

**操作 DB**

> 整个操作 db 时 基于 Prisma ORM 框架做的； 具体可参加: [prisma crud](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

样例如下:

```ts
// ./app/services/user.ts
export default class UserServices extends Service {
  public async registerUser(username: string, password: string): Promise<User | null | boolean> {
    const { prisma } = this.app;

    const has = await this.findUser(username, password);
    if (has) {
      return true;
    }
    const user = await prisma.user.create({
      data: {
        username,
        password: encode(password),
        uid: getUUID()
      }
    });
    return user;
  }

  public async findUser(
    username: string,
    password: string,
    original = false
  ): Promise<User | null> {
    const { prisma } = this.app;
    const user = await prisma.user.findFirst({
      where: {
        username,
        password: original ? password : encode(password)
      }
    });
    return user;
  }
}
```

### 2. jwt 配置 及 `token` 秘钥

```js
// ./config/config.default.ts
// jwt
config.jwt = {
  // please replace the secret
  secret: '123456'
};
```

**jwt 及 登录态校验 已默认集成，有兴趣可参考文件 app/extend/application.ts 和 app/middleware/jwt.ts**

### 3. redis 的配置和使用

如果您只有单个 只需要在 `.env` 文件中配置即可

```bash
# redis 配置
# redis 端口
REDIS_PORT = 6379
# redis host
REDIS_HOST= "127.0.0.1"
# redis 密码
REDIS_PASSWORD = "auth"

```

若想进一步对 redis 进行配置可以在如下文件中配置

```js
// ./config/config.default.ts
config.redis = {
  Redis: require('ioredis'),
  client: {
    port: process.env.REDIS_PORT || 6379, // Redis port
    host: process.env.REDIS_HOST || '127.0.0.1', // Redis host
    password: process.env.REDIS_PASSWORD || 'auth',
    db: 0
    // this redis instance won't block app start
    // weakDependent: true,
  }
};
```

**redis 的使用**

```ts
// 设置
this.app.redis.set(key, value);
// 获取
this.app.redis.get(key);
```

### 微信小程序登录配置及使用

在`.env`文件中配置自己的小程序 appid 和 appsecret:

```bash
# .env

# 你的微信 小程序id 在公众开发者后台可以看到
WECHAT_MINI_APP_ID= "your wechat appid"
# 你的微信小程序 secret ，在公众开发者后台可以看到
WECHAT_MINI_APP_SECRET= "your wechat secret"
```

**使用手册**

在小程序中请求如下接口:

```bash
# 请求地址  xxx 为你部署的域名
xxx/wechat/mini/login?js_code=fghjklkhgfghjk

```

## 三、项目测试

```bash
npm run dev
```

### 用户注册

![](./docs//imgs/register.png)

### 用户登录

![](./docs//imgs/login.png)

### 接口测试/鉴权测试

![](./docs//imgs/test.png)

## 四、打包部署

```bash

# 构建镜像
docker build -t prisma-egg-node .

# 启动
docker run -p 7001:7001 -d --name prisma-egg-node-instance prisma-egg-node

```
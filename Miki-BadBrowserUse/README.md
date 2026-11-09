# Miki-BadBrowserUse

A zero-Browser-Use-Cloud-cost browser automation project using **Playwright + GitHub Actions + Chromium**.

目标：在 ChatGPT 对话中提交 GitHub 代码任务，通过 GitHub Actions 执行公开网页操作，获取浏览器截图与 JSON 结果；后续协助真实用户申请 **Azure for Students** 和 **Oracle Cloud Always Free**，保持零付费、不升级付费账户。

## 已实现（v0.1）

- GitHub Actions 在 Ubuntu 24.04 上安装 Chromium 并运行 Playwright。
- 访问 Azure for Students 与 Oracle Free Tier 官方公开页面。
- 在 Selenium 公共演示页面填写并提交不含个人数据的表单，用于验证浏览器交互能力。
- 保存 `artifacts/results.json`、`artifacts/summary.md`、PNG 截图，上传为 GitHub Actions Artifact。
- 白名单目标，仅运行公开测试，不访问已经登录的账号。

## 在当前实验仓库运行

本项目暂存于 `mikidaren/plugins` 的 `experiment/playwright-browser-20261110` 分支，代码位于 `Miki-BadBrowserUse/`。对应工作流为 `.github/workflows/miki-badbrowseruse.yml`。

修改 `Miki-BadBrowserUse/**` 会触发实验分支上的工作流；也可在 Actions 里手动运行并选择 `all`、`demo`、`azure` 或 `oracle`。

## 迁移到独立仓库

新建 `mikidaren/Miki-BadBrowserUse`（建议 **private**，不要将任何个人信息或验证材料公开）。将这个文件夹中的 `package.json`、`src/`、`docs/` 放到新仓库根目录，再将工作流复制到新仓库的 `.github/workflows/browser.yml`，并按新根目录调整两个 `working-directory` 和 Artifact 路径；工作流的 push 分支应改为 `main`。

现有 GitHub ChatGPT 连接允许在已存在仓库创建文件，却未提供创建仓库的工具。新仓库需要通过 GitHub 官方创建入口建立后才能直接迁移。

## 边界与执行原则

**不要**把用户名、密码、2FA、短信验证码、学生证、证件、银行卡信息、支付卡验证、邮箱 Token、登录 Cookie、会话截图存入 GitHub 仓库、Actions 日志或 Artifact。即使在 private 仓库也不要这么做。

- Azure：真实学籍认证；只申请 Azure for Students；绝不升级 Pay As You Go。
- Oracle：真实身份及支付方式验证由用户本人完成；只使用 Always Free 配额，避免试用赠金之外的资源。
- 人工认证需在平台官方安全页面本人接管；GitHub Actions 是**短生命周期的无状态 Runner**，不适合处理需要持续登录的注册会话。
- 不绕过 CAPTCHA、短信/邮箱验证、支付验证，不重复注册账户领取新用户资格。
- 只有明确查到已开通且计费为零时，才宣布拿到服务器。实际完成状态参见 `docs/STATUS.md`。

详细步骤见 `docs/REGISTRATION.md` 和 `docs/SECURITY.md`。

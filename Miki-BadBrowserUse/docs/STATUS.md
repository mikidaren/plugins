# 项目进度（2026-11-10）

## 已核实

- ChatGPT 通过 GitHub 连接有权限写入现有仓库。
- 早期独立 Playwright 测试：GitHub Actions 运行成功，Chromium 实际打开 Example、Azure Students 和 Oracle Free Tier 三个公开网页，HTTP 均为 200，并生成 PNG 截图。
- 早期成功运行：https://github.com/mikidaren/plugins/actions/runs/42720945011
- 新项目源码暂存于现有仓库的实验分支；仍需迁移到 `mikidaren/Miki-BadBrowserUse`。

## 最新验证
- 2026-11-10，工作流 https://github.com/mikidaren/plugins/actions/runs/42722710161 执行成功。
- Selenium 公共表单：输入模拟文本并点击 Submit，页面显示 Form submitted，已截图。
- Azure Students 与 Oracle Cloud Free Tier 公开页面：HTTP 200，已保存页面标题、标题文本及截图。
- 生成 Artifact miki-browser-results；未输入真实账户、验证码、学校信息或银行卡。

## 尚未完成

- [ ] 独立仓库实际创建（当前连接缺少 GitHub 创建仓库动作）
- [x] 新项目中带点击/输入的公共演示表单测试通过（GitHub Actions Run 42722710161）
- [ ] Azure for Students 账号注册及本人学籍认证
- [ ] Oracle Cloud Free Tier 账号注册及本人支付方式验证
- [ ] Azure VM 实际开通及免费额度核实
- [ ] Oracle Always Free VM 实际开通及免费额度核实

当前无任何 Azure/Oracle 服务器已建立的证据，不得报告已领取成功。

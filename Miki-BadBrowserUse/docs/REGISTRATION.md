# 注册执行检查表（真实身份、零付费）

本文件是工作流目标，不代表账号已注册或服务器已创建。

## Azure for Students

官方入口：https://azure.microsoft.com/en-us/free/students/

- [ ] 从官方入口登录或创建真实 Microsoft 账户
- [ ] 由本人使用可验证的学校身份完成学籍验证，不使用虚构学校或他人身份
- [ ] 订阅必须显示 **Azure for Students**，不应为 Pay As You Go
- [ ] 确认 $100 学生赠金的有效期和到期行为
- [ ] 仅创建已经核实包含在免费/赠金额度内的虚拟机，并检查磁盘、公网 IP、流量可能产生的费用
- [ ] 在费用管理中设置提醒并定期复核余额；警报本身不保证自动阻止账单
- [ ] 确认 Linux VM 能够 SSH 登录，记录资源类型与预计费用为零的证据（不要上传登录凭据）

资格核查：通常要求 18 岁以上、符合条件的高等院校全日制学生、学校邮箱验证，一人只能使用规定数量的学生优惠。$100 赠金有效期为 12 个月，可否续期由资格决定。

官方说明：https://learn.microsoft.com/en-us/azure/education-hub/find-ids

## Oracle Cloud Always Free

官方入口：https://www.oracle.com/cloud/free/

- [ ] 从官方入口注册真实 Oracle Cloud 账户
- [ ] 由本人完成手机号、付款方式和任何身份验证
- [ ] 仔细选择 Home Region（免费计算资源通常须在该区域创建）
- [ ] 保持 Free Tier / Always Free，不升级 Pay As You Go
- [ ] 选择明确标注 **Always Free** 的计算实例、启动卷、网络资源
- [ ] 实例规格及月度额度以 Oracle 当前官方控制台和文档为准
- [ ] 排除收费的附加磁盘、负载均衡、快照等服务
- [ ] 验证公网网络和 SSH；出现收费提示就停止，不自动确认

官方说明：https://docs.oracle.com/en/learn/cloud_free_tier/index.html

## ChatGPT / GitHub Actions 的角色

1. 可以通过 GitHub 创建、修改 Playwright 脚本并执行公开页面检查。
2. 可以在 GitHub Actions 读取经脱敏的标题、按钮名称、公开 URL 和截图。
3. 不在 Runner 中执行真实账户登录。身份、验证码、银行卡、学校证明必须在官方页面由本人完成。
4. 完成验证后，可在适当授权的独立连接中核实账户状态；不得上传长期凭据到仓库。

## 完成判定

- Azure：已订阅学生计划，已创建可访问的免费/赠金范围内 VM，核实不会启用超额收费。
- Oracle：已开通 Free Tier，已创建明确标记为 Always Free 的 VM，配置 SSH，当前计费没有付费资源。
- 项目：测试和部署流水线通过，配置与敏感信息隔离，保留安全文档。

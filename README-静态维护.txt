皓镧资产官网 — 纯静态维护说明
================================

技术约束
--------
仅使用 HTML + CSS + JavaScript。不要引入 React / Vue / npm / 构建工具。
本地预览：双击打开 HTML，或用任意静态服务器。


目录结构（常用）
----------------
*.html          各业务页面
css/            样式（tokens / common / 各页专属）
js/             脚本（common 及按需页）
assets/images/  图片
assets/videos/  视频文件


如何新增一个内容模块（不新增整页）
--------------------------------
1. 打开对应页面 HTML（如 notice.html）
2. 复制已有同类区块（如一条公告、一张岗位卡）
3. 改标题、时间、正文或图片路径
4. 保存后刷新浏览器查看


如何新增整页
------------
1. 复制结构最完整的现有页（建议 about.html 或 contact.html）
2. 改文件名、<title>、Banner、主内容
3. 引入该页专属 css/xxx.css（可新建空文件再写样式）
4. 在全部页面的导航中增加链接，并设置当前页 is-active
5. 底部 PUBLIC-FOOTER 保持与其他页一致


如何同步导航 / 底部（重要）
--------------------------
公共区用注释标注：
  <!-- PUBLIC-NAV:START --> ... <!-- PUBLIC-NAV:END -->
  <!-- PUBLIC-FOOTER:START --> ... <!-- PUBLIC-FOOTER:END -->

修改导航或底部时：
1. 先在一份页面改好
2. 将上述注释之间的整段 HTML 复制到其余所有 .html 业务页
3. 仅当前页保留 class="site-nav__link is-active" 与 aria-current="page"
4. index.html 若仅做跳转，可不挂完整导航


内容增删改对照
--------------
关于我们     → about.html   + css/about.css
主营业务     → business.html + css/business.css
服务流程     → process.html  + css/process.css (+ js/process.js 如有)
精英团队     → team.html     + css/team.css
政策解读     → policy.html   + css/policy.css + js/policy.js
企业公告     → notice.html   + css/notice.css
皓镧商学院   → college.html  + css/college.css
短视频专区   → video.html    + css/video.css + js/video.js
             视频文件放 assets/videos/，在卡片 data-src 填写路径
加入我们     → join.html     + css/join.css + js/join.js
联系我们     → contact.html  + css/contact.css + js/contact.js

全站色板/字号 → css/tokens.css
导航菜单/按钮/底部 → css/common.css + js/common.js


表单说明（无后端）
----------------
留言（contact）与简历投递（join）：
- 前端校验后写入浏览器 localStorage
- 提示用户通过 mailto 或官方电话完成正式提交
- 替换邮箱时同步改：页面 mailto 链接 + js 内常量


待替换素材
----------
详见根目录：待替换素材清单.md


上线前建议
----------
1. 替换备案号、电话、地址、二维码、地图
2. 逐页检查手机宽度（约 375px）与桌面宽度
3. 确认免责声明与版权仍在底部
4. 删除或归档本说明中的「待替换」占位内容
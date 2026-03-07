/**
 * @fileoverview 手杀风格角色弹窗
 * 特点：官阶系统、详细资料弹窗、胜率显示、查看名片功能
 */
import { lib, game, ui, get, ai, _status } from "noname";
import { createBaseCharacterPlugin } from "./base.js";
import { applyOutcropAvatar } from "../../../src/ui/outcropAvatar.js";
import { skillButtonTooltip } from "../../../src/ui/skillButtonTooltip.js";

export function createShoushaCharacterPlugin(lib, game, ui, get, ai, _status, app) {
	const base = createBaseCharacterPlugin(lib, game, ui, get, ai, _status, app);

	// 常量配置
	const CONSTANTS = {
		IMAGE_PATH: "extension/十周年UI/ui/assets/character/shousha/",
		AUDIO_PATH: "../extension/十周年UI/ui/assets/lbtn/shousha/",
		VIP_TYPES: ["无名杀会员", "移动版会员", "Online会员", "一将成名会员", "怒焰三国杀会员", "欢乐三国杀会员", "名将杀会员", "阵面对决会员"],
		NICKNAMES: [
			/*●*/
			"月萧/凌梦",
			"掏粪大王",
			"子琪",
			"诗笺",
			"水乎",
			"点点",
			"可乐加冰",
			"微微小曦子",
			"啦啦啦",
			"幸运鼠鼠出大红",
			"典狱长",
			"格赫萝斯",
			"赛义德",
			"哈得森",
			"安全总监德沐兰",
			"麦小鼠",
			"疯医",

			"氪金抽66",
			"卡宝真可爱",
			"蒸蒸日上",
			"六千大败而归",
			"开局酒古锭",
			"遇事不决刷个乐",
			"见面两刀喜相逢",
			"时代的六万五",
			"韩旭",
			"司马长衫",
			"狗卡不如无名杀",
			"王八万",
			"一拳兀突骨",
			"开局送神将",
			"丈八二桃",
			"装甲车车",
			"等我喝口酒",
			"马",
			"aoe银钱豹",
			"没有丈八就托管",
			"无中yyds",
			"给咸鱼鸽鸽打call",
			"小零二哟～",
			"长歌最帅了",
			"大猫有侠者之风",
			"布灵布灵❤️",
			"我爱～摸鱼🐠～",
			"小寻寻真棒",
			"呲牙哥超爱笑",
			"是俺杀哒",
			"阿七阿七",
			"祖安·灰晖是龙王",
			"吃颗桃桃好遗计",
			"好可宣✓良民",
			"藏海表锅好",
			"金乎？木乎？水乎！！",
			"无法也无天",
			"司马小渔",
			"西风不识相",
			"神秘喵酱",
			"星城在干嘛？",
			"子鱼今天摸鱼了吗？",
			"阳光苞里有阳光",
			"诗笺的小裙裙",
			"轮回中的消逝",
			"乱踢jb的云野",
			"小一是不是...是不是...",
			"美羊羊爱瑟瑟",
			"化梦的星辰",
			"杰哥带你登dua郎",
			"世中君子人",
			"叹年华未央",
			"短咕咕",
			"洛天依？！",
			"黄老板是好人～",
			"来点瑟瑟文和",
			"鲨鱼配辣椒",
			"萝卜～好萝卜",
			"废城君",
			"E佬细节鬼才",
			"感到棘手要怀念谁？",
			"半价小薯片",
			"JK欧拉欧拉欧拉",
			"新年快乐",
			"乔姐带你飞",
			"12345678？",
			"缘之空",
			"小小恐龙",
			"教主：杀我！",
			"才思泉涌的司马",
			"我是好人",
			"喜怒无常的大宝",
			"阴间杀～秋",
			"敢于劈瓜的关羽",
			"暮暮子",
		],
		TITLES: [
			"幸运爆棚",
			"可可爱爱",
			"蒸蒸日上",
			"司马小渔",
			"当街弑父",
			"霹雳弦惊",
			"玄铁赛季",
			"大败而归",
			"好谋无断",
			"当机立断",
			"侠肝义胆",
			"无敌之人",
			"颇有家资",
			"韩旭的马",
			"司马长衫",
			"野猪突击",
			"杀杀杀杀",
			"俺也一样",
			"一拳兀突骨",
			"开局送一波",
			"丈八二桃把营连",
			"没事儿我掉什么血",
			"痛饮庆功酒",
			"男上加男",
			"马到成功",
			"这么说你很勇哦",
			"高风亮节",
			"白银赛季",
			"攻城拔寨",
			"建功立业",
			"很有智慧",
			"古之恶来",
			"猛虎啸林",
			"龙泉鱼渊",
			"兵起玄黄",
			"勇气参与奖",
			"敢不敢比划比划？",
			"是俺杀哒，都是俺杀哒！",
			"阿弥陀佛",
			"拦住他就要歪嘴了",
			"吃颗桃桃好遗计",
			"花姑娘的干活",
			"如履薄冰",
			"龙虎英雄傲苍穹",
			"无法也无天",
			"西风不识相",
			"你过江我也过江",
			"中门对狙",
			"好色之徒",
			"建安风骨",
			"高门雅士",
			"以一敌千",
			"恣意狂纵",
			"零陵上将军",
			"泥菩萨过江",
			"变化万千",
			"杰哥带你登dua郎",
		],
	};

	return {
		...base,
		skinName: "shousha",

		// 获取势力背景图
		getGroupBackgroundImage(group) {
			if (!group || group === "unknown") {
				return `${CONSTANTS.IMAGE_PATH}character/name2_unknown.png`;
			}
			if (!this.validGroups.includes(group)) group = "default";
			return `${CONSTANTS.IMAGE_PATH}character/name2_${group}.png`;
		},

		// 创建露头适配
		createLeftPane(parent) {
			const skin = lib.config["extension_十周年UI_outcropSkin"];
			const classMap = { shizhounian: ".left3", shousha: ".left2" };
			return ui.create.div(classMap[skin] || ".left", parent);
		},

		click: {
			...base.click,

			playerIntro(e, node) {
				e?.preventDefault();
				e?.stopPropagation();
				const plugin = this;
				const player = node || this;

				// 每次都重新创建对话框
				if (plugin.playerDialog) {
					plugin.playerDialog.remove();
					plugin.playerDialog = null;
				}

				const container = ui.create.div(".popup-container.hidden", ui.window, ev => {
					if (ev.target === container) {
						container.hide();
						game.resume2();
					}
				});

				container.show = function (player) {
					const randomData = plugin.utils.generateRandomData(player);
					const dialog = ui.create.div(".shousha-character-dialog.popped", container);
					const blackBg1 = ui.create.div(".blackBg.one", dialog);
					const blackBg2 = ui.create.div(".blackBg.two", dialog);
					const basicInfo = ui.create.div(".basicInfo", blackBg1);

					// 官阶显示
					plugin.createOfficialInfo(blackBg1, player, randomData);

					// 战绩显示
					const fightbg = ui.create.div(".fight-bg", blackBg1);
					const rightPane = ui.create.div(".right", blackBg2);
					const mingcheng = ui.create.div(".mingcheng", basicInfo);
					const dengji = ui.create.div(".dengji", basicInfo);

					// 胜率/逃率
					plugin.createRateDisplay(fightbg, player, randomData);

					// 查看名片按钮
					const viewCard = ui.create.div(".viewBusinessCard", "查看名片", blackBg1);
					viewCard.onclick = () => {
						container.hide();
						game.resume2();
						const popup = plugin.createDetailPopup(player, randomData);
						document.body.appendChild(popup);
						popup.style.display = "block";
						popup.addEventListener("click", ev => {
							if (ev.target === popup) {
								popup.style.display = "none";
								game.resume2();
							}
						});
					};

					// 武将卡片
					plugin.createCharacterCards(blackBg2, rightPane, player);

					// 昵称和等级
					mingcheng.innerHTML = player.nickname || (player === game.me ? lib.config.connect_nickname : get.translation(player.name));
					dengji.innerText = `Lv：${player === game.me ? 220 : randomData.level}`;

					// 技能列表
					plugin.createSkillList(rightPane, player, container);

					dialog.classList.add("single");
					container.classList.remove("hidden");
					game.pause2();
				};

				plugin.playerDialog = container;
				container.show(player);
			},
		},

		// 创建官阶信息
		createOfficialInfo(parent, player, randomData) {
			const officalbg = ui.create.div(".offical-bg", parent);
			const officalIcon = ui.create.div(".offical-icon", officalbg);

			const isMe = player === game.me;
			const level = isMe ? 11 : randomData.guanjieLevel;
			const text = isMe ? "大元帅" : this.guanjieTranslation[level][0];

			officalIcon.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}dengjie/offical_icon_${level}.png`);
			ui.create.div(".offical-text", `<center>${text}`, officalbg);
		},

		// 创建胜率显示
		createRateDisplay(parent, player, randomData) {
			const isMe = player === game.me;
			const winRate = isMe ? this.utils.calculateWinRate().toFixed(2) : this.utils.getRandomPercentage();
			const runRate = isMe ? "0.00" : this.utils.getRandomPercentage();
			const imgPath = `${CONSTANTS.IMAGE_PATH}num/`;

			const shenglv = ui.create.div(".shenglv", parent);
			const taolv = ui.create.div(".shenglv", parent);

			shenglv.innerHTML = `<span>胜&nbsp;率：</span><div style="margin-top:-30px;margin-left:60px;display:flex;align-items:flex-start;">${this.utils.numberToImages(winRate, imgPath)}</div>`;
			taolv.innerHTML = `<span>逃&nbsp;率：</span><div style="margin-top:-30px;margin-left:60px;display:flex;align-items:flex-start;">${this.utils.numberToImages(runRate, imgPath)}</div>`;
		},

		// 创建武将卡片
		createCharacterCards(blackBg2, rightPane, player) {
			const isUnseen = cls => player.classList.contains(cls) && player !== game.me;

			if (!player.name2) {
				// 单武将
				let name = player.name1 || player.name;
				if (isUnseen("unseen")) name = "unknown";

				const biankuang = ui.create.div(".biankuang", blackBg2);
				const leftPane = this.createLeftPane(biankuang);

				if (isUnseen("unseen")) {
					biankuang.setBackgroundImage(this.getGroupBackgroundImage("unknown"));
					leftPane.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}hidden_image.jpg`);
				} else {
					biankuang.setBackgroundImage(this.getGroupBackgroundImage(player.group));
					leftPane.style.backgroundImage = player.node.avatar.style.backgroundImage;
				}

				this.utils.createCharButton(name, leftPane);

				const nameDiv = ui.create.div(".biankuangname", biankuang);
				nameDiv.innerHTML = get.slimName(name);

				if (!isUnseen("unseen")) {
					const stars = ui.create.div(".xing", biankuang);
					this.utils.createStars(stars, game.getRarity(player.name));
				}
			} else {
				// 双武将
				rightPane.style.left = "280px";
				rightPane.style.width = "calc(100% - 300px)";

				let name1 = player.name1 || player.name;
				let name2 = player.name2;
				const group1 = lib.character[name1]?.[1];
				const group2 = lib.character[name2]?.[1];

				if (isUnseen("unseen")) name1 = "unknown";
				if (isUnseen("unseen2")) name2 = "unknown";

				// 第一个武将
				const biankuang1 = ui.create.div(".biankuang", blackBg2);
				const leftPane1 = this.createLeftPane(biankuang1);

				if (isUnseen("unseen")) {
					biankuang1.setBackgroundImage(this.getGroupBackgroundImage("unknown"));
					leftPane1.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}hidden_image.jpg`);
				} else {
					biankuang1.setBackgroundImage(this.getGroupBackgroundImage(group1));
					leftPane1.style.backgroundImage = player.node.avatar.style.backgroundImage;
				}

				// 第二个武将
				const biankuang2 = ui.create.div(".biankuang2", blackBg2);
				const leftPane2 = this.createLeftPane(biankuang2);

				if (isUnseen("unseen2")) {
					biankuang2.setBackgroundImage(this.getGroupBackgroundImage("unknown"));
					leftPane2.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}hidden_image.jpg`);
				} else {
					biankuang2.setBackgroundImage(this.getGroupBackgroundImage(group2));
					leftPane2.setBackground(name2, "character");
				}

				this.utils.createCharButton(name1, leftPane1);
				this.utils.createCharButton(name2, leftPane2);

				const nameDiv1 = ui.create.div(".biankuangname", biankuang1);
				const nameDiv2 = ui.create.div(".biankuangname2", biankuang2);
				nameDiv1.innerHTML = get.slimName(name1);
				nameDiv2.innerHTML = get.slimName(name2);

				if (!isUnseen("unseen")) {
					const stars1 = ui.create.div(".xing", biankuang1);
					this.utils.createStars(stars1, game.getRarity(player.name));
				}
				if (!isUnseen("unseen2")) {
					const stars2 = ui.create.div(".xing", biankuang2);
					this.utils.createStars(stars2, game.getRarity(player.name2));
				}
			}
		},

		// 创建详细资料弹窗
		createDetailPopup(player, randomData) {
			const popup = ui.create.div(".popup-container", { background: "rgb(0,0,0,0.8)" }, ui.window);

			// 关闭按钮
			const guanbi = ui.create.div(".guanbi", popup);
			guanbi.addEventListener("click", () => {
				popup.style.display = "none";
				game.playAudio(`${CONSTANTS.AUDIO_PATH}caidan.mp3`);
			});

			const bigdialog = ui.create.div(".bigdialog", popup);

			// 头像信息
			this.createAvatarInfo(bigdialog, player, randomData);
			// 官阶信息
			this.createRankInfo(bigdialog, player, randomData);
			// 段位信息
			this.createDuanweiInfo(bigdialog, player, randomData);
			// 擅长武将
			this.createSkillInfo(bigdialog, player, randomData);

			return popup;
		},

		// 创建头像信息
		createAvatarInfo(bigdialog, player, randomData) {
			const minixingxiang = ui.create.div(".minixingxiang", bigdialog);
			const minixingxiangdi = ui.create.div(".minixingxiangdi", bigdialog);
			const xingbie = ui.create.div(".xingbie", minixingxiangdi);
			const xingbietu = ["pubui_icon_male", "pubui_icon_female"];
			xingbie.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}${xingbietu.randomGet()}.png`);

			ui.create.div(
				".nameX",
				minixingxiang,
				player === game.me ? lib.config.connect_nickname : get.translation(CONSTANTS.NICKNAMES.randomGet(1))
			);
			ui.create.div(".wanjiachenghao", bigdialog, get.translation(CONSTANTS.TITLES.randomGet(1)));

			minixingxiang.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}xingxiang${Math.floor(Math.random() * 6)}.png`);
		},

		// 创建官阶信息
		createRankInfo(bigdialog, player, randomData) {
			const guanjie = ui.create.div(".guanjie", bigdialog);
			const guanjieInfo = ui.create.div(".guanjieInfo", bigdialog);
			const level = player === game.me ? 11 : randomData.guanjieLevel;
			guanjie.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}dengjie/offical_icon_${level}.png`);
			guanjieInfo.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}dengjie/offical_label_${level}.png`);
		},

		// 创建段位信息
		createDuanweiInfo(bigdialog, player, randomData) {
			const paiwei = ui.create.div(".paiweiditu", bigdialog);
			const duanwei = ui.create.div(".duanwei", paiwei);
			const duanweiInfo = this.duanweiTranslation[randomData.rankLevel];

			if (player === game.me) {
				ui.create.div(".duanweishuzi", `<center>绝世传说`, paiwei);
				duanwei.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}dengjie/pwtx_6.png`);
			} else {
				ui.create.div(".duanweishuzi", `<center>${duanweiInfo.randomGet()}`, paiwei);
				duanwei.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}dengjie/pwtx_${randomData.rankLevel}.png`);
			}

			ui.create.div(".xinyufen", `鲜花<br>${randomData.lucky}`, paiwei);
			ui.create.div(".renqizhi", `鸡蛋<br>${randomData.popularity}`, paiwei);
			ui.create.div(".paiweiType", "本赛季", paiwei);
			ui.create.div(".typeleft", paiwei);

			const typeright = ui.create.div(".typeright", paiwei);
			const width = (randomData.gailevel / 100) * 75;

			if (player === game.me) {
				typeright.style.width = "0px";
				ui.create.div(".dengjiX", "0%", paiwei);
				ui.create.div(".huiyuanX", "220级", paiwei);
			} else {
				typeright.style.width = width + "px";
				ui.create.div(".dengjiX", randomData.gailevel + "%", paiwei);
				ui.create.div(".huiyuanX", randomData.level + "级", paiwei);
			}

			ui.create.div(".gonghui", paiwei, get.translation(`(${CONSTANTS.VIP_TYPES.randomGet(1)})`));
		},

		// 创建技能列表
		createSkillList(rightPane, player, container) {
			rightPane.innerHTML = "<div></div>";
			lib.setScroll(rightPane.firstChild);

			let oSkills = player.getSkills(null, false, false).slice(0);
			oSkills = oSkills.filter(
				skill =>
					lib.skill[skill] &&
					skill !== "jiu" &&
					!lib.skill[skill].nopop &&
					!lib.skill[skill].equipSkill &&
					lib.translate[skill + "_info"] &&
					lib.translate[skill + "_info"] !== ""
			);
			if (player === game.me && player.hiddenSkills.length) oSkills.addArray(player.hiddenSkills);

			const allShown = player.isUnderControl() || (!game.observe && game.me && game.me.hasSkillTag("viewHandcard", null, player, true));
			const shownHs = player.getShownCards();

			// 明置手牌
			if (shownHs.length) {
				ui.create.div(".xcaption", player.hasCard(card => !shownHs.includes(card), "h") ? "明置的手牌" : "手牌区域", rightPane.firstChild);
				shownHs.forEach(item => {
					const card = game.createCard(get.name(item, false), get.suit(item, false), get.number(item, false), get.nature(item, false));
					card.style.zoom = "0.6";
					rightPane.firstChild.appendChild(card);
				});
				if (allShown) {
					const hs = player.getCards("h");
					hs.removeArray(shownHs);
					if (hs.length) {
						ui.create.div(".xcaption", "其他手牌", rightPane.firstChild);
						hs.forEach(item => {
							const card = game.createCard(
								get.name(item, false),
								get.suit(item, false),
								get.number(item, false),
								get.nature(item, false)
							);
							card.style.zoom = "0.6";
							rightPane.firstChild.appendChild(card);
						});
					}
				}
			} else if (allShown) {
				const hs = player.getCards("h");
				if (hs.length) {
					ui.create.div(".xcaption", "手牌区域", rightPane.firstChild);
					hs.forEach(item => {
						const card = game.createCard(get.name(item, false), get.suit(item, false), get.number(item, false), get.nature(item, false));
						card.style.zoom = "0.6";
						rightPane.firstChild.appendChild(card);
					});
				}
			}

			// 技能列表
			if (oSkills.length) {
				const modeCaptionMap = {
					doudizhu: "武将技能·斗地主",
					identity: "武将技能·身份",
					versus: "武将技能·团战",
					single: "武将技能·1v1",
					guozhan: "武将技能·国战",
				};
				const captionText = modeCaptionMap[lib.config.mode] || "武将技能";
				ui.create.div(".xcaption", captionText, rightPane.firstChild);

				oSkills.forEach(name => {
					const skillEnabled = get.info(name)?.enable;
					const skillIcon = skillEnabled ? "sp_zhu" : "sp_bei";
					const baseIcon = `<img src="${CONSTANTS.IMAGE_PATH}${skillIcon}.png" style="width:25px;height:25px;margin-bottom:-7px;">`;
					const transparentIcon = `<img src="${CONSTANTS.IMAGE_PATH}${skillIcon}.png" style="width:25px;height:25px;margin-bottom:-7px;opacity:0.5;">`;
					const skillName = `【${lib.translate[name]}】`;

					// 获取技能描述并格式化
					const rawSkillInfo = skillButtonTooltip.getSkillDescription(name, player);
					const skillInfo = skillButtonTooltip.formatSkillDescription(rawSkillInfo);

					if (player.forbiddenSkills[name]) {
						const conflict = player.forbiddenSkills[name].length
							? `（与${get.translation(player.forbiddenSkills[name])}冲突）`
							: "（双将禁用）";
						ui.create.div(
							".xskill",
							`<div data-color><span style="opacity:0.5">${skillName}</span></div><div><span style="opacity:0.5">${conflict}${skillInfo}</span></div>`,
							rightPane.firstChild
						);
					} else if (player.hiddenSkills.includes(name)) {
						if (lib.skill[name].preHidden && get.mode() === "guozhan") {
							const id = ui.create.div(
								".xskill",
								transparentIcon +
									`<div data-color><span style="opacity:0.5">${skillName}</span></div><div><span style="opacity:0.5">${skillInfo}</span><br><div class="underlinenode on gray" style="position:relative;padding-left:0;padding-top:7px">预亮技能</div></div>`,
								rightPane.firstChild
							);
							const underlinenode = id.querySelector(".underlinenode");
							if (_status.prehidden_skills.includes(name)) underlinenode.classList.remove("on");
							underlinenode.link = name;
							underlinenode.listen(ui.click.hiddenskill);
						} else {
							ui.create.div(
								".xskill",
								transparentIcon +
									`<div data-color><span style="opacity:0.5">${skillName}</span></div><div><span style="opacity:0.5">${skillInfo}</span></div>`,
								rightPane.firstChild
							);
						}
					} else if (!player.getSkills().includes(name) || player.awakenedSkills.includes(name)) {
						ui.create.div(
							".xskill",
							transparentIcon +
								`<div data-color><span style="opacity:0.5">${skillName}</span></div><div><span style="opacity:0.5">${skillInfo}</span></div>`,
							rightPane.firstChild
						);
					} else if (lib.skill[name].frequent || lib.skill[name].subfrequent) {
						const id = ui.create.div(
							".xskill",
							baseIcon +
								`<div data-color>${skillName}</div><div>${skillInfo}<br><div class="underlinenode on gray" style="position:relative;padding-left:0;padding-top:7px">自动发动</div></div>`,
							rightPane.firstChild
						);
						const underlinenode = id.querySelector(".underlinenode");
						const shouldDisable =
							(lib.skill[name].frequent && lib.config.autoskilllist.includes(name)) ||
							(lib.skill[name].subfrequent &&
								lib.skill[name].subfrequent.some(sub => lib.config.autoskilllist.includes(name + "_" + sub)));
						if (shouldDisable) underlinenode.classList.remove("on");
						underlinenode.link = name;
						underlinenode.listen(ui.click.autoskill2);
					} else if (lib.skill[name].clickable && player.isIn() && player.isUnderControl(true) && player === game.me) {
						const id = ui.create.div(
							".xskill",
							baseIcon +
								`<div data-color>${skillName}</div><div>${skillInfo}<br><div class="menubutton skillbutton" style="position:relative;margin-top:5px;color: rgba(255, 203, 0, 1);">点击发动</div></div>`,
							rightPane.firstChild
						);
						const intronode = id.querySelector(".skillbutton");
						if (!_status.gameStarted || (lib.skill[name].clickableFilter && !lib.skill[name].clickableFilter(player))) {
							intronode.classList.add("disabled");
							intronode.style.opacity = 0.5;
						} else {
							intronode.link = player;
							intronode.func = lib.skill[name].clickable;
							intronode.classList.add("pointerdiv");
							intronode.listen(() => {
								container.hide();
								game.resume2();
							});
							intronode.listen(ui.click.skillbutton);
						}
					} else {
						ui.create.div(".xskill", baseIcon + `<div data-color>${skillName}</div><div>${skillInfo}</div>`, rightPane.firstChild);
					}
				});
			}

			// 装备区域
			const eSkills = player.getCards("e");
			if (eSkills.length) {
				ui.create.div(".xcaption", "装备区域", rightPane.firstChild);
				eSkills.forEach(card => {
					const cards = card.cards;
					let isQiexie = card.name.startsWith("qiexie_");
					let displayName = card.name + "_info";
					let str = [get.translation(isQiexie ? card.name : card), get.translation(displayName)];
					// 只有当cards与card本身不同时才添加原卡信息
					if (Array.isArray(cards) && cards.length && (cards.length !== 1 || cards[0].name !== card.name)) {
						str[0] += `（${get.translation(cards)}）`;
					}
					if (lib.card[card.name]?.cardPrompt) {
						str[1] = lib.card[card.name].cardPrompt(card, player);
					}
					if (isQiexie && lib.translate[card.name + "_append"]) {
						str[1] += `<br><br><div style="font-size: 0.85em; font-family: xinwei; line-height: 1.2;">${lib.translate[card.name + "_append"]}</div>`;
					}
					ui.create.div(".xskill", `<div data-color>${str[0]}</div><div>${str[1]}</div>`, rightPane.firstChild);
				});
			}

			// 显示视为装备（extraEquip）
			if (player.extraEquip?.length) {
				const shownEquips = new Set();
				player.extraEquip.forEach(info => {
					const [skillName, equipName, preserve] = info;
					// 检查是否满足视为装备的条件
					if (preserve && !preserve(player)) return;
					// 避免重复显示同一装备
					if (shownEquips.has(equipName)) return;
					shownEquips.add(equipName);

					const skillTrans = lib.translate[skillName] || skillName;
					const equipTrans = lib.translate[equipName] || equipName;
					const equipInfo = lib.translate[equipName + "_info"] || "";
					ui.create.div(
						".xskill",
						`<div data-color>【${skillTrans}】视为装备【${equipTrans}】</div><div>${equipInfo}</div>`,
						rightPane.firstChild
					);
				});
			}

			// 判定区域
			const judges = player.getCards("j");
			if (judges.length) {
				ui.create.div(".xcaption", "判定区域", rightPane.firstChild);
				judges.forEach(card => {
					const cards = card.cards;
					let str = [get.translation(card), get.translation(card.name + "_info")];
					if ((Array.isArray(cards) && cards.length && !lib.card[card]?.blankCard) || player.isUnderControl(true))
						str[0] += `（${get.translation(cards)}）`;
					ui.create.div(".xskill", `<div data-color>${str[0]}</div><div>${str[1]}</div>`, rightPane.firstChild);
				});
			}
		},

		// 创建擅长武将信息
		createSkillInfo(bigdialog, player, randomData) {
			// 按钮
			const buttons =
				player === game.me
					? [
							{ class: "useless1", text: "分享" },
							{ class: "useless2", text: "展示(诏令－1)" },
							{ class: "useless3", text: "调整武将" },
							{ class: "useless4", text: "我的家园" },
						]
					: [
							{ class: "useless1", text: "拉黑名单" },
							{ class: "useless2", text: "私聊" },
							{ class: "useless3", text: "加为好友" },
							{ class: "useless4", text: "教训他" },
						];

			buttons.forEach(btn => {
				const button = ui.create.div(`.${btn.class}`, bigdialog, get.translation(btn.text));
				button.setBackgroundImage(`${CONSTANTS.IMAGE_PATH}useless1.png`);
				button.onclick = function () {
					this.style.transform = "scale(0.9)";
					setTimeout(() => (this.style.transform = "scale(1)"), 100);
					game.playAudio(`${CONSTANTS.AUDIO_PATH}label.mp3`);
				};
			});

			// 擅长武将
			const shanchangdialog = ui.create.div(".shanchangdialog", bigdialog);
			const shanchang = Object.keys(lib.character)
				.filter(key => !lib.filter.characterDisabled(key))
				.randomGets(4);

			for (let i = 0; i < 4; i++) {
				const charName = shanchang[i];
				const group = lib.character[charName][1];
				const charContainer = ui.create.div(".shanchang", shanchangdialog);
				const kuang = ui.create.div(".kuang", charContainer);
				kuang.setBackgroundImage(this.getGroupBackgroundImage(group));

				const leftPane = this.createLeftPane(kuang);
				leftPane.setBackground(charName, "character");
				applyOutcropAvatar(charName, leftPane);

				const xing = ui.create.div(".xing", kuang);
				this.utils.createStars(xing, game.getRarity(charName));

				const biankuangname = ui.create.div(".biankuangname", kuang);
				biankuangname.innerHTML = get.slimName(charName);

				// 换肤按钮
				if (window.zyile_charactercard) {
					const huanfu = ui.create.div(".huanfu", charContainer);
					huanfu.onclick = () => window.zyile_charactercard(charName, charContainer, false);
				}
			}
		},
	};
}

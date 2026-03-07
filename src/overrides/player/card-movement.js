/**
 * @fileoverview 卡牌移动覆写模块
 * @description 处理玩家摸牌、获得牌、给牌、弃牌等卡牌移动相关的覆写方法
 * @module overrides/player/card-movement
 */

import { lib, game, ui, get, ai, _status } from "noname";
import { applyCardBorder } from "../../ui/cardStyles.js";
import { cardSkinMeta } from "../../config/utils.js";//LM修改

/** @type {Function|null} 基础摸牌方法引用 */
let basePlayerDraw = null;

/** @type {Object|null} decadeUI引用（延迟获取） */
let _decadeUI = null;

/**
 * 获取decadeUI引用
 * @returns {Object} decadeUI对象
 */
function getDui() {
	if (!_decadeUI) _decadeUI = window.decadeUI;
	return _decadeUI;
}

/**
 * 设置基础摸牌方法
 * @param {Function} fn - 基础方法
 */
export function setBasePlayerDraw(fn) {
	basePlayerDraw = fn;
}

/**
 * 摸牌动画覆写
 * @description 覆写玩家摸牌的视觉效果，支持卡牌数组或数量参数
 * @param {number|Array} num - 摸牌数量或卡牌数组
 * @param {boolean|string} [init] - 初始化参数，false或'nobroadcast'时不广播
 * @param {Object} [config] - 配置对象
 * @returns {void}
 */
export function playerDraw(num, init, config) {
	if (game.chess) return basePlayerDraw.call(this, num, init, config);

	if (init !== false && init !== "nobroadcast") {
		game.broadcast(
			function (player, num, init, config) {
				player.$draw(num, init, config);
			},
			this,
			num,
			init,
			config
		);
	}

	let cards;
	let isDrawCard;
	if (get.itemtype(num) == "cards") {
		cards = num.concat();
		isDrawCard = true;
	} else if (get.itemtype(num) == "card") {
		cards = [num];
		isDrawCard = true;
	} else if (typeof num == "number") {
		cards = new Array(num);
	} else {
		cards = new Array(1);
	}

	if (init !== false) {
		if (isDrawCard) {
			game.addVideo("drawCard", this, get.cardsInfo(cards));
		} else {
			game.addVideo("draw", this, num);
		}
	}

	if (_status.event && _status.event.name) {
		if (
			(function (event) {
				return event.name != "gain" && !event.name.includes("raw");
			})(_status.event)
		)
			isDrawCard = true;
	}

	if (game.me == this && !isDrawCard) return;

	const fragment = document.createDocumentFragment();
	let card;
	const _dui = getDui();
	const player = this;

	for (let i = 0; i < cards.length; i++) {
		card = cards[i];
		if (card == null) {
			card = _dui.element.create("card thrown drawingcard");
		} else {
			card = card.copy("thrown", "drawingcard", false);
		}
		card.fixed = true;

		if (player !== game.me) {
			applyCardBorder(card, player);
		}
		cards[i] = card;
		fragment.appendChild(card);
	}

	_dui.layoutDrawCards(cards, player, true);
	ui.arena.appendChild(fragment);

	_dui.queueNextFrameTick(function () {
		_dui.layoutDrawCards(cards, player);
		_dui.delayRemoveCards(cards, 460, 220);
	});
}

/**
 * 获得卡牌2覆写
 * @description 处理玩家获得卡牌的视觉效果，区分从场上获得和直接获得
 * @param {Array|Object} cards - 卡牌数组或单张卡牌
 * @param {boolean} [log] - 是否记录日志
 * @returns {void}
 */
export function playerGain2(cards, log) {
	let type = get.itemtype(cards);
	if (type != "cards") {
		if (type != "card") return;
		type = "cards";
		cards = [cards];
	}

	if (log === true) game.log(this, "获得了", cards);

	game.broadcast(
		function (player, cards) {
			player.$gain2(cards);
		},
		this,
		cards
	);

	const gains = [];
	const draws = [];
	let card;
	let clone;
	const player = this;

	for (let i = 0; i < cards.length; i++) {
		clone = cards[i].clone;
		card = cards[i].copy("thrown", "gainingcard");
		card.fixed = true;

		if (player !== game.me) {
			applyCardBorder(card, player);
		}

		if (clone && clone.parentNode == ui.arena) {
			card.scaled = true;
			card.style.transform = clone.style.transform;
			gains.push(card);
		} else {
			draws.push(card);
		}
	}

	if (gains.length) game.addVideo("gain2", this, get.cardsInfo(gains));
	if (draws.length) game.addVideo("drawCard", this, get.cardsInfo(draws));

	if (cards.duiMod && this == game.me) return;

	cards = gains.concat(draws);
	const _dui = getDui();

	_dui.layoutDrawCards(draws, this, true);

	const fragment = document.createDocumentFragment();
	for (let i = 0; i < cards.length; i++) fragment.appendChild(cards[i]);
	ui.arena.appendChild(fragment);

	_dui.queueNextFrameTick(function () {
		_dui.layoutDrawCards(cards, player);
		_dui.delayRemoveCards(cards, 460, 220);
	});
}

/**
 * 给牌动画覆写
 * @description 处理玩家给予其他玩家卡牌的视觉效果
 * @param {Array|number} cards - 卡牌数组或数量
 * @param {Object} target - 目标玩家
 * @param {boolean} [log] - 是否记录日志
 * @param {boolean} [record] - 是否记录到视频
 * @returns {void}
 */
export function playerGive(cards, target, log, record) {
	let itemtype;
	const duiMod = cards.duiMod && game.me == target;

	if (typeof cards == "number") {
		itemtype = "number";
		cards = new Array(cards);
	} else {
		itemtype = get.itemtype(cards);
		if (itemtype == "cards") {
			cards = cards.concat();
		} else if (itemtype == "card") {
			cards = [cards];
		} else {
			return;
		}
	}

	if (record !== false) {
		let cards2 = cards;
		if (itemtype == "number") {
			cards2 = cards.length;
			game.addVideo("give", this, [cards2, target.dataset.position]);
		} else {
			game.addVideo("giveCard", this, [get.cardsInfo(cards2), target.dataset.position]);
		}
		game.broadcast(
			function (source, cards2, target, record) {
				source.$give(cards2, target, false, record);
			},
			this,
			cards2,
			target,
			record
		);
	}

	if (log != false) {
		if (itemtype == "number") {
			game.log(target, "从", this, "获得了" + get.cnNumber(cards.length) + "张牌");
		} else {
			game.log(target, "从", this, "获得了", cards);
		}
	}

	if (this.$givemod) {
		this.$givemod(cards, target);
		return;
	}

	if (duiMod) return;

	let card;
	const _dui = getDui();
	const hand = _dui.boundsCaches.hand;
	hand.check();
	const draws = [];
	const player = this;
	const fragment = document.createDocumentFragment();

	for (let i = 0; i < cards.length; i++) {
		card = cards[i];
		if (card) {
			const cp = card.copy("card", "thrown", "gainingcard", false);
			let hs = player == game.me;

			if (hs) {
				if (card.throwWith) {
					hs = card.throwWith == "h" || card.throwWith == "s";
				} else {
					hs = card.parentNode == player.node.handcards1;
				}
			}

			if (hs) {
				cp.tx = Math.round(hand.x + card.tx);
				cp.ty = Math.round(hand.y + 30 + card.ty);
				cp.scaled = true;
				cp.style.transform = "translate(" + cp.tx + "px," + cp.ty + "px) scale(" + hand.cardScale + ")";
			} else {
				draws.push(cp);
			}
			card = cp;
		} else {
			card = _dui.element.create("card thrown gainingcard");
			draws.push(card);
		}
		cards[i] = card;
		cards[i].fixed = true;
		fragment.appendChild(cards[i]);
	}

	if (draws.length) _dui.layoutDrawCards(draws, player);
	ui.arena.appendChild(fragment);

	_dui.queueNextFrameTick(function () {
		_dui.layoutDrawCards(cards, target);
		_dui.delayRemoveCards(cards, 460, 220);
	});
}

//LM修改
/**
 * 弃牌动画覆写
 * @description 处理玩家弃牌的视觉效果
 * @param {Array|number} cards - 卡牌数组或数量
 * @param {number} [time] - 动画时间（未使用）
 * @param {boolean} [record] - 是否记录到视频
 * @param {boolean} [nosource] - 是否无来源（影响卡牌初始位置）
 * @returns {HTMLElement} 最后一张卡牌元素
 */
export function playerThrow(card, time, init, nosource, cardsetion) {
	if (!cardsetion && cardsetion !== false && lib.config
		.card_animation_info) {
		let source = this;
		if (["useCard", "respond"].includes(get.event().name)) source = get
			.player();
		cardsetion = get.cardsetion(source);
	}

	if (typeof card == "number") {
		var tmp = card;
		card = [];
		while (tmp--) {
			var cardx = ui.create.card();
			cardx.classList.add("infohidden");
			cardx.classList.add("infoflip");
			if (cardsetion) {
				var next = ui.create.div(".cardsetion", cardsetion, cardx);
				next.style.setProperty("display", "block", "important");
				if (cardx.node) {
					if (cardx.node.cardsetion) {
						cardx.node.cardsetion.remove();
						delete cardx.node.cardsetion;
					}
					cardx.node.cardsetion = next;
				}
			}
			card.push(cardx);
		}
	}

	if (init !== false) {
		if (init !== "nobroadcast") {
			game.broadcast(
				function (player, card, time, init, nosource,
					cardsetion) {
					player.$throw(card, time, init, nosource,
						cardsetion);
				},
				this,
				card,
				time,
				init,
				nosource,
				cardsetion
			);
		}
		if (get.itemtype(card) != "cards") {
			if (get.itemtype(card) == "card") {
				card = [card];
			} else {
				return;
			}
		}
		game.addVideo("throw", this, [get.cardsInfo(card), time, nosource]);
	}
	for (var i = card.length - 1; i >= 0; i--)
		this.$throwordered2(card[i].copy("thrown"), nosource);
	if (game.chess) {
		this.chessFocus();
	}
	return card[card.length - 1];
}
/**
 * 弃牌动画2覆写
 * @description 处理单张卡牌的弃牌视觉效果
 * @param {HTMLElement} card - 卡牌元素
 * @param {boolean} [nosource] - 是否无来源
 * @returns {HTMLElement} 卡牌元素
 */
export function playerThrowordered2(card, nosource) {
	if (_status.connectMode) ui.todiscard = [];
	const _dui = getDui();
	if (card.throwordered == undefined) {
		const bounds = _dui.boundsCaches.arena;
		if (!bounds.updated) bounds.update();
		this.checkBoundsCache();
		let x, y;
		if (nosource) {
			x = (bounds.width - bounds.cardWidth) / 2 - bounds.width * 0.08;
			y = (bounds.height - bounds.cardHeight) / 2;
		} else {
			x = (this.cacheWidth - bounds.cardWidth) / 2 + this.cacheLeft;
			y = (this.cacheHeight - bounds.cardHeight) / 2 + this.cacheTop;
		}
		card.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px) scale(${bounds.cardScale})`;
	} else {
		card.throwordered = undefined;
	}
	card.classList.add("thrown");
	if (card.fixed) return ui.arena.appendChild(card);
	let before;
	for (const i = 0; i < ui.thrown; i++) {
		if (ui.thrown[i].parentNode == ui.arena) {
			before = ui.thrown[i];
			break;
		}
	}
	//牌面信息添加
	if (1) {
		let node = card;
		const player = this;
		let event = _status.event.blameEvent ? _status.event.blameEvent : _status.event;
		let eventInfo;
		const playername = get.translation(player);
		//事件名称
		let getName = function (card, player, event) {
			if (!card || !player || !event) return;
			if (event.blameEvent) event = event.blameEvent;
			let tagText;
			const playername = get.slimName(player?.name);
			let border = get.groupnature(get.bordergroup(player?.name));
			let eventInfo = `<span style="font-weight:700"><span data-nature=${border}><span style="letter-spacing:0.1em">${playername}</span></span><br/><span style="color:#FFD700">`;
			switch (event.name) {
				case "useCard":
				case "respond":
					tagText = eventInfo + (event.name === "useCard" ? "使用" : "打出") + "</span>";
					break;
				default:
					tagText = get.cardsetion(player);
					break;
			}
			return tagText;
		};
		eventInfo = getName(node, player, event);
		if (node && node.node) {
			const cardInfo = {
				name: get.name(node),
				number: get.number(node),
				suit: get.suit(node),
			};
			game.broadcastAll(
				(node, eventInfo, { name, number, suit }, event) => {
					let card = node;
					if (!node.node) {
						node = [...ui.arena.childNodes].find(c => {
							if (c.classList.contains("thrown") && c.classList.contains("card")) {
								const n = get.number(c);
								const na = get.name(c);
								const s = get.suit(c);
								if (n === number && na === name && s === suit && !c.selectedt) {
									c.selectedt = true;
									return true;
								}
							}
						});
					}
					if (!node) return;/*●*/
					if (!node.node) return;
					const no = ["image", "info", "name", "name2", "background", "intro", "range", "gaintag"];
					const some = [...node.childNodes].some(n => {
						if (n.innerText && eventInfo.includes && eventInfo.includes(n.innerText) && !no.includes(n.classList[0])) {
							n.innerHTML = eventInfo;
							return true;
						}
					});
					if (some) return;
					if (!node.node.cardsetion) {
						node.node.cardsetion = ui.create.div(".used-info", eventInfo, node);
					} else {
						node.node.cardsetion.innerHTML = eventInfo || playername;
					}
				},
				node,
				eventInfo,
				cardInfo,
				event
			);
			const addStyle = () => {
				const style = document.createElement("style");
				style.innerHTML = /*css*/ `
					.card .tempname.tempimage {
						opacity:1 !important;
					}   
				`;
				document.head.appendChild(style);
			};
			if (!game.throwCardStyle) {
				addStyle();
				game.throwCardStyle = true;
			}
			if (lib.node && lib.node.clients) {
				lib.node.clients.forEach(c => {
					if (!c.gameOptions) {
						c.gameOptions = {};
					}
					if (!c.gameOptions.Cardstyle) {
						c.send(addStyle);
						c.gameOptions.Cardstyle = true;
					}
				});
			}
			game.addVideo("cardInfo", null, {
				eventInfo,
				cardInfo,
			});
		}
		//播放动画骨骼
		switch (event.name) {
			//使用打出牌
			case "useCard":
			case "respond":
				const cardname = event.card.name,
					cardnature = get.nature(event.card);
				if (lib.config.cardtempname != "off" && (card.name != cardname || !get.is.sameNature(cardnature, card.nature, true))) {
					if (!card._tempName) card._tempName = ui.create.div(".temp-name", card);
					var tempname = "";
					var tempname2 = get.translation(cardname);
					if (cardnature) {
						card._tempName.dataset.nature = cardnature;
						if (cardname == "sha") {
							tempname2 = get.translation(cardnature) + tempname2;
						}
					}
					let vname2 = cardname;
					if (cardnature && cardname == "sha") vname2 = cardname + "_" + cardnature;

					const skinKey = decadeUI.config.cardPrettify;
					const skin = cardSkinMeta[skinKey];
					const folder = skin ? (skin.dir || skinKey) : skinKey;
					const extension = skin ? (skin.extension || "png") : "png";
					let path = `extension/十周年UI/image/card-skins/${folder}/${vname2}.${extension}`;

					let zhuanimgPath = "extension/十周年UI/zq/image/card-base/zhuan.png"; // 右上角叠加图片

					if (game.FileExist(path)) {
						card._tempName.innerHTML = "";
						card._tempName.tempname = "";
						card._tempName.setBackgroundImage(path);
						card._tempName.style.top = "0";
						card._tempName.style.height = "100%";
						card._tempName.style.backgroundSize = "100% 100%";

						let zhuanimg = document.createElement("img");
						zhuanimg.src = zhuanimgPath;
						zhuanimg.style.position = "absolute";
						zhuanimg.style.top = "0";
						zhuanimg.style.right = "0";
						zhuanimg.style.width = "40px";
						zhuanimg.style.height = "40px";
						zhuanimg.style.zIndex = "3";
						card._tempName.appendChild(zhuanimg);
					}
					else {
						tempname += tempname2;
						card._tempName.innerHTML = tempname;
						card._tempName.tempname = tempname;

						let zhuanimg = document.createElement("img");
						zhuanimg.src = zhuanimgPath;
						zhuanimg.style.position = "absolute";
						zhuanimg.style.top = "-65px";
						zhuanimg.style.right = "0";
						zhuanimg.style.width = "40px";
						zhuanimg.style.height = "40px";
						zhuanimg.style.zIndex = "3";
						card._tempName.appendChild(zhuanimg);
					}
				}
				const cardnumber = get.number(event.card),
					cardsuit = get.suit(event.card);
				if (card.dataset && card.dataset.views != 1 && event.card.cards && event.card.cards.length == 1 && (card.number != cardnumber || card.suit != cardsuit)) {
					decadeUI.cardTempSuitNum(card, cardsuit, cardnumber);
				}
				if (event.card && (!event.card.cards || !event.card.cards.length || event.card.cards.length == 1)) {
					var name0 = event.card.name,
						nature = event.card.nature;
					switch (name0) {
						case "effect_caochuanjiejian":
							decadeUI.animation.cap.playSpineTo(card, "effect_caochuanjiejian");
							break;
						case "sha":
							switch (nature) {
								case "thunder":
									decadeUI.animation.cap.playSpineTo(card, "effect_leisha");
									break;
								case "fire":
									decadeUI.animation.cap.playSpineTo(card, "effect_huosha");
									break;
								case "ice":
									decadeUI.animation.cap.playSpineTo(card, "effect_bingsha");
									break;
								case "kami":
									decadeUI.animation.cap.playSpineTo(card, "effect_shesha");
									break;
								default:
									if (get.color(card) == "red") {
										decadeUI.animation.cap.playSpineTo(card, "effect_hongsha");
									} else {
										decadeUI.animation.cap.playSpineTo(card, "effect_heisha");
									}
									break;
							}
							break;
						case "shan":
							decadeUI.animation.cap.playSpineTo(card, "effect_shan");
							break;
						case "tao":
							decadeUI.animation.cap.playSpineTo(card, "effect_tao", {
								scale: 0.9,
							});
							break;
						case "tiesuo":
							decadeUI.animation.cap.playSpineTo(card, "effect_tiesuolianhuan", {
								scale: 0.9,
							});
							break;
						case "jiu":
							decadeUI.animation.cap.playSpineTo(card, "effect_jiu", {
								y: [-30, 0.5],
							});
							break;
						case "kaihua":
							decadeUI.animation.cap.playSpineTo(card, "effect_shushangkaihua");
							break;
						case "wuzhong":
							decadeUI.animation.cap.playSpineTo(card, "effect_wuzhongshengyou");
							break;
						case "wuxie":
							decadeUI.animation.cap.playSpineTo(card, "effect_wuxiekeji", {
								y: [10, 0.5],
								scale: 0.9,
							});
							break;
						// case "juedou":
						// 	decadeUI.animation.cap.playSpineTo(card, "SF_eff_jiangling_juedou", {
						// 		x: [10, 0.4],
						// 		scale: 1,
						// 	});
						// 	break;
						// case "nanman":
						// 	decadeUI.animation.cap.playSpineTo(card, "effect_nanmanruqin", {
						// 		scale: 0.45,
						// 	});
						// 	break;
						// case "wanjian":
						// 	decadeUI.animation.cap.playSpineTo(card, "effect_wanjianqifa", {
						// 		scale: 0.78,
						// 	});
						// 	break;
						case "wugu":
							decadeUI.animation.cap.playSpineTo(card, "effect_wugufengdeng", {
								y: [10, 0.5],
							});
							break;
						case "taoyuan":
							decadeUI.animation.cap.playSpineTo(card, "SF_kapai_eff_taoyuanjieyi", {
								y: [10, 0.5],
							});
							break;
						case "shunshou":
							decadeUI.animation.cap.playSpineTo(card, "effect_shunshouqianyang");
							break;
						case "huogong":
							decadeUI.animation.cap.playSpineTo(card, "effect_huogong", {
								x: [8, 0.5],
								scale: 0.5,
							});
							break;
						case "guohe":
							decadeUI.animation.cap.playSpineTo(card, "effect_guohechaiqiao", {
								y: [10, 0.5],
							});
							break;
						case "yuanjiao":
							decadeUI.animation.cap.playSpineTo(card, "effect_yuanjiaojingong");
							break;
						case "zhibi":
							decadeUI.animation.cap.playSpineTo(card, "effect_zhijizhibi");
							break;
						case "zhulu_card":
							decadeUI.animation.cap.playSpineTo(card, "effect_zhulutianxia");
							break;
					}
				}
				break;
			//判定
			case "judge":
				event.addMessageHook("judgeResult", function () {
					var event = this;
					var card = event.result.card.clone;
					var apcard = event.apcard;
					if (!card) return;
					if (event.result.suit != get.suit(card) || event.result.number != get.number(card)) {
						decadeUI.cardTempSuitNum(card, event.result.suit, event.result.number);
					}
					var action;
					var judgeValue;
					var getEffect = event.judge2;
					if (getEffect) {
						judgeValue = getEffect(event.result);
					} else {
						judgeValue = decadeUI.get.judgeEffect(event.judgestr, event.result.judge);
					}
					if (typeof judgeValue == "boolean") {
						judgeValue = judgeValue ? 1 : -1;
					} else {
						judgeValue = event.result.judge;
					}
					if (judgeValue >= 0) {
						action = "play4";
					} else {
						action = "play5";
					}
					if (apcard && apcard._ap) apcard._ap.stopSpineAll();
					if (apcard && apcard._ap && apcard == card) {
						apcard._ap.playSpine({
							name: "effect_panding",
							action: action,
						});
					} else {
						decadeUI.animation.cap.playSpineTo(card, {
							name: "effect_panding",
							action: action,
						});
					}
					event.apcard = undefined;
				});
				decadeUI.animation.cap.playSpineTo(card, {
					name: "effect_panding",
					action: "play",
					loop: true,
				});
				event.apcard = card;
				break;
		}
	}
	ui.thrown.push(card);
	if (before) ui.arena.insertBefore(before, card);
	else ui.arena.appendChild(card);
	decadeUI.queueNextFrameTick(decadeUI.layoutDiscard, decadeUI);
	return card;
}
//结束

/**
 * 阶段判定覆写
 * @description 处理判定阶段的卡牌展示效果，支持低性能模式优化
 * @param {Object} card - 判定卡牌
 * @returns {void}
 */
export function playerPhaseJudge(card) {
	game.addVideo("phaseJudge", this, get.cardInfo(card));

	const player = this;

	if (card[card.cardSymbol]?.cards?.length) {
		const cards = card[card.cardSymbol].cards;
		const clone = player.$throw(cards);

		if (lib.config.low_performance && cards[0] && cards[0].clone) {
			const waitingForTransition = get.time();
			_status.waitingForTransition = waitingForTransition;
			cards[0].clone.listenTransition(function () {
				if (_status.waitingForTransition == waitingForTransition && _status.paused) {
					game.resume();
				}
			});
			game.pause();
		} else {
			getDui().delay(451);
		}
	} else {
		const VCard = game.createCard(card.name, "虚拟", "");
		const clone = player.$throw(VCard);

		if (lib.config.low_performance && VCard && VCard.clone) {
			const waitingForTransition = get.time();
			_status.waitingForTransition = waitingForTransition;
			VCard.clone.listenTransition(function () {
				if (_status.waitingForTransition == waitingForTransition && _status.paused) {
					game.resume();
				}
			});
			game.pause();
		} else {
			getDui().delay(451);
		}
	}
}

/**
 * 添加虚拟判定覆写
 * @description 处理虚拟判定牌的添加和显示
 * @param {Object} VCard - 虚拟卡牌对象
 * @param {Array} cards - 实际卡牌数组
 * @returns {void}
 */
export function playerAddVirtualJudge(VCard, cards) {
	if (game.online) return;

	const player = this;
	const card = VCard;
	const isViewAsCard = cards.length !== 1 || cards[0].name !== VCard.name || !card.isCard;

	let cardx;
	if (get.itemtype(card) == "card" && card.isViewAsCard) {
		cardx = card;
	} else {
		cardx = isViewAsCard
			? game.createCard(card.name, cards.length == 1 ? get.suit(cards[0]) : "none", cards.length == 1 ? get.number(cards[0]) : 0)
			: cards[0];
	}

	game.broadcastAll(
		(player, cardx, isViewAsCard, VCard, cards) => {
			cardx.fix();

			if (!cardx.isViewAsCard) {
				const cardSymbol = Symbol("card");
				cardx.cardSymbol = cardSymbol;
				cardx[cardSymbol] = VCard;
			}

			cardx.style.transform = "";
			cardx.classList.remove("drawinghidden");
			delete cardx._transform;

			if (isViewAsCard && !cardx.isViewAsCard) {
				cardx.isViewAsCard = true;
				cardx.destroyLog = false;

				for (let i of cards) {
					i.goto(ui.special);
					i.destiny = player.node.judges;
				}

				if (cardx.destroyed) cardx._destroyed_Virtua = cardx.destroyed;
				cardx.destroyed = function (card, id, player, event) {
					if (card._destroyed_Virtua) {
						if (typeof card._destroyed_Virtua == "function") {
							let bool = card._destroyed_Virtua(card, id, player, event);
							if (bool === true) return true;
						} else if (lib.skill[card._destroyed_Virtua]) {
							if (player) {
								if (player.hasSkill(card._destroyed_Virtua)) {
									delete card._destroyed_Virtua;
									return false;
								}
							}
							return true;
						} else if (typeof card._destroyed_Virtua == "string") {
							return card._destroyed_Virtua == id;
						} else if (card._destroyed_Virtua === true) return true;
					}
					if (id == "ordering" && ["phaseJudge", "executeDelayCardEffect"].includes(event.getParent().name)) return false;
					if (id != "judge") {
						return true;
					}
				};
			}

			cardx.classList.add("drawinghidden");

			if (isViewAsCard) {
				cardx.cards = cards || [];
				cardx.viewAs = VCard.name;
				const bgMark = lib.translate[cardx.viewAs + "_bg"] || get.translation(cardx.viewAs)[0];

				if (cardx.classList.contains("fullskin") || cardx.classList.contains("fullborder") || cardx.classList.contains("fullimage")) {
					cardx.classList.add("fakejudge");

					if (cardx.classList.contains("fullimage")) {
						cardx.classList.remove("fullimage");
						cardx.classList.add("fullskin");
						cardx.style.backgroundImage = "";
					}

					if (window.decadeUI) {
						cardx.node.judgeMark.node.judge.innerHTML = bgMark;
					} else {
						cardx.node.background.innerHTML = bgMark;
					}
				}
			} else {
				delete cardx.viewAs;
				cardx.classList.remove("fakejudge");
				if (window.decadeUI) {
					cardx.node.judgeMark.node.judge.innerHTML = lib.translate[cardx.name + "_bg"] || get.translation(cardx.name)[0];
				}
			}

			player.node.judges.insertBefore(cardx, player.node.judges.firstChild);

			// 判定标记美化
			const judgeMarkMap = [
				"bingliang",
				"lebu",
				"shandian",
				"fulei",
				"hongshui",
				"huoshan",
				"caomu",
				"jlsgqs_shuiyanqijun",
				"jydiy_zouhuorumo",
				"jydiy_yungongliaoshang",
				"xwjh_biguanqingxiu",
				"xwjh_wushisanke",
				"xumou_jsrg",
				"dczixi_bingliang",
				"dczixi_lebu",
				"dczixi_shandian",
			];
			/*●*/
			if (window.decadeUI) {
				if (judgeMarkMap.includes(cardx.name)) {
					let imageName = cardx.name;
					const judgeText = lib.translate[cardx.name + "_bg"] || get.translation(cardx.name) || "";
					cardx.node.judgeMark.node.judge.innerText = "";
					cardx.node.judgeMark.node.judge.style.fontSize = "";

					const isDecadeStyle =
						lib.config.extension_十周年UI_newDecadeStyle === "on" || lib.config.extension_十周年UI_newDecadeStyle === "othersOff";
					const ext = isDecadeStyle && ["bingliang", "lebu", "shandian"].includes(imageName) ? "1.png" : ".png";
					const basePath = `${lib.assetURL}extension/十周年UI/image/ui/judge-mark/`;

					const tryImg = new Image();
					tryImg.onload = function () {
						cardx.node.judgeMark.node.judge.style.backgroundImage = `url("${tryImg.src}")`;
						cardx.node.judgeMark.node.judge.innerText = "";
						cardx.node.judgeMark.node.judge.style.fontSize = "0px";
					};
					tryImg.onerror = function () {
						cardx.node.judgeMark.node.judge.style.backgroundImage = `url("${basePath}tongyong.png")`;
						cardx.node.judgeMark.node.judge.innerText = judgeText ? judgeText[0] : "";
					};
					tryImg.src = `${basePath}${imageName}${ext}`;

					cardx.node.judgeMark.node.judge.style.zIndex = "99";
					cardx.node.judgeMark.node.judge.parentElement.children[0].style.background = "none";
					cardx.node.judgeMark.node.judge.parentElement.children[0].style.display = "none";
				} else {
					cardx.node.judgeMark.node.judge.style.backgroundImage = `url("${lib.assetURL}extension/十周年UI/image/ui/judge-mark/tongyong.png")`;
				}
			}
			ui.updatej(player);
		},
		player,
		cardx,
		isViewAsCard,
		VCard,
		cards
	);
}
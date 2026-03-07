/**●全文替换
 * @fileoverview UI模块公共常量
 */

/** @type {Record<string, string>} 样式配置值到样式名的映射 */
export const STYLE_TO_SKIN = {
	off: "shousha",
	on: "shizhounian",
	othersOff: "xinsha",
	onlineUI: "online",
	babysha: "baby",
	codename: "codename",
};

/** @type {string} 默认样式名 */
export const DEFAULT_SKIN = "shizhounian";

// 国战身份颜色
export const GUOZHAN_IDENTITY_COLORS = [
	{ key: "unknown", color: "#FFFFDE" },
	{ key: "wei", color: "#0075FF" },
	{ key: "shu", color: "#ff0000" },
	{ key: "wu", color: "#00ff00" },
	{ key: "qun", color: "#ffff00" },
	{ key: "jin", color: "#9e00ff" },
	{ key: "ye", color: "#9e00ff" },
	{ key: "key", color: "#9e00ff" },
];

// 身份颜色
export const IDENTITY_COLORS = {
	zhu: "#ae5f35",
	zhong: "#e9d765",
	fan: "#87a671",
	nei: "#9581c4",
};
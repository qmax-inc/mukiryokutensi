//=============================================================================
// RPGツクールMV - LL_OutlineColorAutoMV.js v1.0.1
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// URL below for license details.
// https://nine-yusha.com/plugin/
//=============================================================================

/*:
 * @target MV
 * @plugindesc 文字の縁取り色を自動で判定して切替します。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-autooutlinecolor/
 *
 * @help LL_OutlineColorAutoMV.js
 *
 * 文字の縁取り色を自動で判定して切替します。
 * 白に近い色の時は黒、黒に近い色の時は白で表示します。
 *
 * 明度のしきい値について:
 *   数値を大きくすると白と判定される範囲が大きくなります。(0～100で調整)
 *   ※100にすると全ての縁取り色が白色になります。
 *
 * プラグインコマンドはありません。
 *
 * 利用規約:
 *   ・著作権表記は必要ございません。
 *   ・利用するにあたり報告の必要は特にございません。
 *   ・商用・非商用問いません。
 *   ・R18作品にも使用制限はありません。
 *   ・ゲームに合わせて自由に改変していただいて問題ございません。
 *   ・プラグイン素材としての再配布（改変後含む）は禁止させていただきます。
 *
 * 作者: ルルの教会
 * 作成日: 2021/7/30
 *
 * @param brightEvaluation
 * @text 明度のしきい値
 * @desc 縁取り色を白と判定するしきい値です。(0～100、初期: 60)
 * 数値を大きくすると白で表示される判定が大きくなります。
 * @default 60
 * @min 0
 * @max 100
 * @type number
 *
 * @param outlineColorBlack
 * @text 縁取り色(黒)
 * @desc 文字の縁取り色(黒)です。
 * @default rgba(0, 0, 0, 0.5)
 * @type string
 *
 * @param outlineColorWhite
 * @text 縁取り色(白)
 * @desc 文字の縁取り色(白)です。
 * @default rgba(255, 255, 255, 0.9)
 * @type string
 */

(function() {
	"use strict";
	var pluginName = "LL_OutlineColorAutoMV";

	var parameters = PluginManager.parameters(pluginName);
	var brightEvaluation = Number(parameters["brightEvaluation"] || 60);
	var outlineColorBlack = String(parameters["outlineColorBlack"] || "rgba(0, 0, 0, 0.5)");
	var outlineColorWhite = String(parameters["outlineColorWhite"] || "rgba(255, 255, 255, 0.9)");

	// 明度自動判定
    var getBright = function (color) {
		if (color.slice(0, 1) == "#") color = color.slice(1);
		if (color.length == 3) {
			color = color.slice(0, 1) + color.slice(0, 1) + color.slice(1, 2) + color.slice(1, 2) + color.slice(2, 3) + color.slice(2, 3);
		}

		var rgb = [color.slice(0, 2), color.slice(2, 4), color.slice(4, 6)].map(function(str) {
			return parseInt(str, 16);
		});

        return Math.max(rgb[0], rgb[1], rgb[2]) / 255;
    };


	var _Window_Base_resetTextColor = Window_Base.prototype.resetTextColor;
	Window_Base.prototype.resetTextColor = function() {
		_Window_Base_resetTextColor.apply(this, arguments);

		this.changeOutlineColorAuto(this.normalColor());
	};

	var _Window_Base_changeTextColor = Window_Base.prototype.changeTextColor;
	Window_Base.prototype.changeTextColor = function(color) {
		_Window_Base_changeTextColor.apply(this, arguments, color);

		this.changeOutlineColorAuto(color);
    };

	Window_Base.prototype.changeOutlineColorAuto = function(color) {
		var bright = getBright(color) <= (brightEvaluation / 100);
		this.contents.outlineColor = !bright ? outlineColorBlack : outlineColorWhite;
    };
})();

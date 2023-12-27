//=============================================================================
// WindowCorsorColorChange.js
//=============================================================================

/*:
 * @plugindesc ウィンドウカーソルの色と明滅ペースを変更します。
 * @author 村人Ａ
 *
 * @param カーソルの色
 * @desc カーソルの色をＲ,Ｂ,Ｇで指定します。それぞれ0～255の間で指定してください。
 * @default 244,150,94
 *
 * @param カーソル明滅フレーム数
 * @desc カーソル明滅の反転するまでのフレーム数を指定します。値が大きいほど明滅スパンが長くなります。
 * @default 30
 * @type number
 *
 * @help
 * ==============================
 * バージョン管理
 * ==============================
 * 18/11/29  ver 1.0　リリース
 * 
 * ==============================
 * ヘルプ
 * ==============================
 * ウィンドウのカーソルの色と明滅のペースを変更します。
 * ウィンドウスキンの画像img/system/Window.pngはデフォルトのものを使ってください。
 * デフォルトのものでなくてもカーソルの色がデフォルトのものであれば問題ございません。
 * 色と明滅フレーム数はプラグインパラメータにて変更してください。
 * 
 * 不具合・不備・ご不明点等ございましたら
 * villaa.contact＠gmail.com
 * までご連絡ください。（＠は半角に）
 * 
*/

(function() {
	
	String.prototype.cnvtNumArray = function() {
		var strArr = this.split(',');
		var result = strArr.map(function(str){
			return Number(str);
		});
		return result
	}
	
    var parameters = PluginManager.parameters('WindowCorsorColorChange');
	windowCursorColorArray = String(parameters["カーソルの色"] || '244,150,94').cnvtNumArray();
	windowCursorBlinkingFrame = Number(parameters["カーソル明滅フレーム数"] || 30);
	
	
	var _alias_WCCC_Window_refreshCursor = Window.prototype._refreshCursor;
	Window.prototype._refreshCursor = function() {
		_alias_WCCC_Window_refreshCursor.call(this)
		var bitmap = this._windowCursorSprite.bitmap;
		bitmap.adjustTone(-214, -255, -241)
		var c = windowCursorColorArray;
		bitmap.adjustTone(c[0], c[1], c[2]);
	};

	Window.prototype._updateCursor = function() {
		var bf = windowCursorBlinkingFrame
		var maxCount = bf * 2;
		var blinkCount = this._animationCount % maxCount;
		var cursorOpacity = this.contentsOpacity;
		if (this.active) {
			var fadeRate = Math.round(255 / bf);
			if (blinkCount < bf) {
				cursorOpacity -= blinkCount * fadeRate;
			} else {
				cursorOpacity -= (maxCount - blinkCount) * fadeRate;
			}
		}
		this._windowCursorSprite.alpha = cursorOpacity / 255;
		this._windowCursorSprite.visible = this.isOpen();
	};
})();
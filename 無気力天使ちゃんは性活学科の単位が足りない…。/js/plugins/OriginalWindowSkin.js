"use strict";
/*:
 * @plugindesc 自作の一枚画像をウィンドウに適用します。
 * @author ei1chi
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * ============================================================
 *  OriginalWindowSkin.js
 *  v0.1.0
 * ============================================================
 * 自作の一枚画像をウィンドウの見た目に適用するプラグインです。
 * ツクールの標準機能では不可能だった、自由な見た目のウィンドウを作ることができます。
 * 代わりにウィンドウの開閉動作がフェードイン・アウトに置き換わっていますので、ご了承ください。
 *
 * ※現在はメッセージウィンドウのみ対応。
 * 　今後、対応ウィンドウを追加予定。
 *
 * ------------------------------------------------------------
 *  使い方
 * ------------------------------------------------------------
 * ウィンドウとして使いたい画像を、img/pictures/内に
 * "Window_Original.png"として追加します。※今後変更される可能性があります
 *
 * メッセージウィンドウのサイズは標準で"816x180"ピクセルです。
 * このサイズでの画像作成をお勧めします。
 *
 * ------------------------------------------------------------
 *  注意点
 * ------------------------------------------------------------
 * ・デプロイメント時「未使用ファイルを含まない」オプションを有効にすると
 * 　スキン画像が出力されません！
 * 　手動でデプロイメント先にコピーする必要があります。
 * ・公式ツール"MADO"によるウィンドウ拡張との併用は未検証です（検証予定）。
 * ・その他、ウィンドウ系プラグインと併用すると問題が発生する可能性があります。
 *
 * ------------------------------------------------------------
 *  使用許諾
 * ------------------------------------------------------------
 * ・使用の際に連絡およびクレジット表記は不要です。
 * ・自由に改変して利用して構いません。
*/
(function (_) {
    // 画像ファイル読み込み（キャッシュに投入）
    Window_Base.prototype.loadWindowskin = function () {
        this.originalSkin = ImageManager.loadPicture("Window_Original");
        this.windowskin = ImageManager.loadSystem("Window");
    };
    var __initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function () {
        __initialize.call(this);
        this._refreshAllParts();
    };
    // 背景画像の処理を削除
    Window_Message.prototype._refreshBack = function () { };
    // 画像更新処理を変更
    Window_Message.prototype._refreshFrame = function () {
        var w = this._width;
        var h = this._height;
        var bitmap = new Bitmap(w, h);
        this._windowFrameSprite.bitmap = bitmap;
        this._windowFrameSprite.setFrame(0, 0, w, h);
        if (this.originalSkin !== null) {
            bitmap.blt(this.originalSkin, 0, 0, w, h, 0, 0);
        }
    };
    // openness設定時の挙動を変更（重要ポイント）
    Object.defineProperty(Window_Message.prototype, "openness", {
        get: function () {
            return this._openness;
        },
        set: function (value) {
            if (this._openness !== value) {
                this._openness = value.clamp(0, 255);
                this._windowFrameSprite.opacity = value;
            }
        },
        configurable: true
    });
})();

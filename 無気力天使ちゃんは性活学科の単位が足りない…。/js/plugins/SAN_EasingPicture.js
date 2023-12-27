//=============================================================================
// SAN_EasingPicture.js
//=============================================================================
// Copyright (c) 2018 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc イージングピクチャ ver1.1.0
 * ピクチャ毎のモーション毎にイージングを設定
 * @author サンシロ https://twitter.com/rev2nym
 * @version 1.1.0 2018/04/05 対応するイージング種別の追加。「Tween.js」連携の追加。
 * 1.0.0 2018/02/17 作成。
 * 
 * @help
 * ■概要
 * ピクチャ毎のモーション毎にイージングを設定します。
 * 対応するモーションは次の通りです。
 *   ・座標移動
 *   ・縮尺変化
 *   ・不透明度変化
 *   ・色調変化
 * 
 * 「Tween.js」を導入することで特殊なイージングに対応します。
 * 
 * ■イージングの設定
 * 次のスクリプトコマンドによって
 * 指定したピクチャのモーションにイージングを設定します。
 * 
 *   $gameScreen.setPictureEasing(pictureId, motionType, easingType);
 *     ・pictureId  : ピクチャ番号を指定する数値
 *     ・motionType : モーション種別を指定する文字列
 *     ・easingType : イージング種別を指定する文字列
 * 
 * ■設定のリセット
 * 次のスクリプトコマンドによって
 * 指定したピクチャにイージング設定をリセットします。
 * 
 *   $gameScreen.resetPictureEasing(pictureId, motionType);
 *     ・pictureId  : ピクチャ番号を指定する数値
 *     ・motionType : モーション種別を指定する文字列
 * 
 * ■モーション種別
 * モーション種別に設定可能な文字列は次の通りです。
 *   ・'move' : 座標移動
 *   ・'zoom' : 縮尺変更
 *   ・'fade' : 不透明度変更
 *   ・'tint' : 色調変更
 *   ・'all'  : 上記すべてのモーション
 * 
 * ■イージング種別
 * イージング種別に設定可能な文字列は次の通りです。
 * 「In」は加速、「Out」は減速、「InOut」は加速後減速を表します。
 * 
 * ・基本的なイージング
 *   次の種別のイージングはこのプラグインのみで実行できます。
 * 
 *   ・'linear'
 *     一定の変化量で動作します。
 * 
 *   ・'easeInQuad', 'easeOutQuad', 'easeInOutQuad'
 *     二次関数曲線に従って動作します。
 * 
 *   ・'easeInCubic', 'easeOutCubic', 'easeInOutCubic'
 *     三次関数曲線に従って動作します。
 * 
 *   ・'easeInQuart', 'easeOutQuart', 'easeInOutQuart'
 *     四次関数曲線に従って動作します。
 * 
 *   ・'easeInQuint', 'easeOutQuint', 'easeInOutQuint'
 *     五次関数曲線に従って動作します。
 * 
 *   ・'easeInSine', 'easeOutSine', 'easeInOutSine'
 *     サイン関数曲線に従って動作します。
 * 
 *   ・'easeInCirc', 'easeOutCirc', 'easeInOutCirc'
 *     円曲線に従って動作します。
 * 
 *   ・'easeInExpo', 'easeOutExpo', 'easeInOutExpo'
 *     指数曲線に従って動作します。
 * 
 * ・特殊なイージング
 *   次の種別のイージングはこの「Tween.js」を導入すると実行できます。
 * 
 *   ・'easeInBack', 'easeOutBack', 'easeInOutBack'
 *     一度逆方向に振れてから目標値へ向かう動作をします。
 * 
 *   ・'easeInElastic', 'easeOutElastic', 'easeInOutElastic'
 *     弾力で震えるような動作をします。
 * 
 *   ・'easeInBounce', 'easeOutBounce', 'easeInOutBounce'
 *     目標値で跳ね返り弾む動作をします。
 * 
 *   「Tween.js」はMITライセンスのJSアニメーションライブラリです。
 *   次のURLから入手することができます。
 *   https://github.com/tweenjs/tween.js/
 *   jsファイルはsrcディレクトリ内にあります。
 *   他のツクールMVのプラグインと同じように導入することができます。
 * 
 * ■設定例
 * 設定には「スクリプト」コマンドを使用します。
 * プラグインコマンドではないことに注意してください。
 * 
 * ・ピクチャ3番の座標移動をサイン変化で加速変化するように設定
 *     $gameScreen.setPictureEasing(3, 'move', 'easeInSine');
 * 
 * ・ピクチャ5番の縮尺変更を四次変化で加減速変化するように設定
 *     $gameScreen.setPictureEasing(5, 'zoom', 'easeInOutQuart');
 * 
 * ・ピクチャ6番のすべてのモーションのイージング設定をリセット
 *     $gameScreen.resetPictureEasing(6, 'all');
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * よかったらクレジットに作者名を記載してください。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

var Imported = Imported || {};
Imported.SAN_EasingPicture = true;

var Sanshiro = Sanshiro || {};
Sanshiro.SAN_EasingPicture = Sanshiro.SAN_EasingPicture || {};
Sanshiro.SAN_EasingPicture.version = '1.1.0';

(function() {
'use strict';

// プラグイン名称
var pluginName = 'SAN_EasingPicture';

// プラグインパラメータ
var pluginParameters = PluginManager.parameters(pluginName);

//-----------------------------------------------------------------------------
// Easing
//
// イージング

function Easing() {
    throw new Error('This is a static class');
}

// linear
Easing.linear = function(rate) {
    return rate;
};

// easeInSine
Easing.easeInSine = function(rate) {
    return Math.cos(rate * Math.PI / 2 - Math.PI) + 1.0;
};

// easeOutSine
Easing.easeOutSine = function(rate) {
    return Math.sin(rate * Math.PI / 2);
};

// easeOutInSine
Easing.easeInOutSine = function(rate) {
    return (rate < 0.5 ?
        Easing.easeInSine(rate * 2) / 2 :
        Easing.easeOutSine((rate - 0.5) * 2) / 2 + 0.5
    );
};

// easeInQuad
Easing.easeInQuad = function(rate) {
    return Math.pow(rate, 2);
};

// easeOutQuad
Easing.easeOutQuad = function(rate) {
    return 1.0 - Math.pow(1.0 - rate, 2);
};

// easeInOutQuad
Easing.easeInOutQuad = function(rate) {
    return (rate < 0.5 ?
        Easing.easeInQuad(rate * 2) / 2 :
        Easing.easeOutQuad((rate - 0.5) * 2) / 2 + 0.5
    );
};

// easeInCubic
Easing.easeInCubic = function(rate) {
    return Math.pow(rate, 3);
};

// easeOutCubic
Easing.easeOutCubic = function(rate) {
    return 1.0 - Math.pow(1.0 - rate, 3);
};

// easeInOutCubic
Easing.easeInOutCubic = function(rate) {
    return (rate < 0.5 ?
        Easing.easeInCubic(rate * 2) / 2 :
        Easing.easeOutCubic((rate - 0.5) * 2) / 2 + 0.5
    );
};

// easeInQuart
Easing.easeInQuart = function(rate) {
    return Math.pow(rate, 4);
};

// easeOutQuart
Easing.easeOutQuart = function(rate) {
    return 1.0 - Math.pow(1.0 - rate, 4);
};

// easeInOutQuart
Easing.easeInOutQuart = function(rate) {
    return (rate < 0.5 ?
        Easing.easeInQuart(rate * 2) / 2 :
        Easing.easeOutQuart((rate - 0.5) * 2) / 2 + 0.5
    );
};

// easeInQuint
Easing.easeInQuint = function(rate) {
    return Math.pow(rate, 5);
};

// easeOutQuint
Easing.easeOutQuint = function(rate) {
    return 1.0 - Math.pow(1.0 - rate, 5);
};

// easeInOutQuint
Easing.easeInOutQuint = function(rate) {
    return (rate < 0.5 ?
        Easing.easeInQuint(rate * 2) / 2 :
        Easing.easeOutQuint((rate - 0.5) * 2) / 2 + 0.5
    );
};

// easeInCirc
Easing.easeInCirc = function(rate) {
    return 1.0 - Math.sqrt(1.0 - Math.pow(rate, 2));
};

// easeOutCirc
Easing.easeOutCirc = function(rate) {
    return Math.sqrt(1.0 - Math.pow((rate - 1.0), 2));
};

// easeInOutCirc
Easing.easeInOutCirc = function(rate) {
    return (rate < 0.5 ?
        Easing.easeInCirc(rate * 2) / 2 :
        Easing.easeOutCirc((rate - 0.5) * 2) / 2 + 0.5
    );
};

// easeInExpo
Easing.easeInExpo = function(rate) {
    var base = 2;
    var exponent = 10;
    return Math.pow(base, (exponent * (rate - 1.0)));
};

// easeOutExpo
Easing.easeOutExpo = function(rate) {
    var base = 2;
    var exponent = 10;
    return 1.0 - Math.pow(base, -(exponent * rate));
};

// easeInOutExpo
Easing.easeInOutExpo = function(rate) {
    return (rate < 0.5 ?
        Easing.easeInExpo(rate * 2) / 2 :
        Easing.easeOutExpo((rate - 0.5) * 2) / 2 + 0.5
    );
};

// 以下Tween.js導入時に使用可能
// easeInBack
Easing.easeInBack = function(rate) {
    return TWEEN.Easing.Back.In(rate);
};

// easeOutBack
Easing.easeOutBack = function(rate) {
    return TWEEN.Easing.Back.Out(rate);
};

// easeInOutBack
Easing.easeInOutBack = function(rate) {
    return TWEEN.Easing.Back.InOut(rate);
};

// easeInElastic
Easing.easeInElastic = function(rate) {
    return TWEEN.Easing.Elastic.In(rate);
};

// easeOutElastic
Easing.easeOutElastic = function(rate) {
    return TWEEN.Easing.Elastic.Out(rate);
};

// easeInOutElastic
Easing.easeInOutElastic = function(rate) {
    return TWEEN.Easing.Elastic.InOut(rate);
};

// easeInBounce
Easing.easeInBounce = function(rate) {
    return TWEEN.Easing.Bounce.In(rate);
};

// easeOutBounce
Easing.easeOutBounce = function(rate) {
    return TWEEN.Easing.Bounce.Out(rate);
};

// easeInOutBounce
Easing.easeInOutBounce = function(rate) {
    return TWEEN.Easing.Bounce.InOut(rate);
};

//-----------------------------------------------------------------------------
// Game_Screen
//
// スクリーン

// オブジェクト初期化
var _Game_Screen_initialize = 
    Game_Screen.prototype.initialize;
Game_Screen.prototype.initialize = function() {
    _Game_Screen_initialize.call(this);
    this.initPictureEasings();
};

// ピクチャリスト
Game_Screen.prototype.pictures = function() {
    return this._pictures;
};

// ピクチャイージング設定リストの初期化
Game_Screen.prototype.initPictureEasings = function() {
    this._pictureEasings = {};
};

// ピクチャイージング設定の初期化
Game_Screen.prototype.initPictureEasing = function(realPictureId) {
    this._pictureEasings[realPictureId] = this.defaultPictureEasing();
};

// ピクチャイージング設定の存在判定
Game_Screen.prototype.existsPictureEasing = function(realPictureId) {
    return !!this._pictureEasings[realPictureId];
};

// ピクチャイージング設定の初期値
Game_Screen.prototype.defaultPictureEasing = function() {
    return {
        move : 'linear',
        zoom : 'linear',
        fade : 'linear',
        tint : 'linear'
    };
};

// ピクチャイージング設定の取得
Game_Screen.prototype.pictureEasing = function(realPictureId) {
    return (!!this._pictureEasings[realPictureId] ? 
        this._pictureEasings[realPictureId] :
        this.defaultPictureEasing()
    );
};

// ピクチャイージング設定の設定
Game_Screen.prototype.setPictureEasing =
    function(pictureId, motionType, easingType)
{
    this.checkEasingParams(motionType, easingType);
    var realPictureId = this.realPictureId(pictureId);
    if (!this.existsPictureEasing(realPictureId)) {
        this.initPictureEasing(realPictureId);
    }
    if (motionType === 'all') {
        for(var motionType in this._pictureEasings[realPictureId]) {
            this._pictureEasings[realPictureId][motionType] = easingType;
        }
    } else {
        this._pictureEasings[realPictureId][motionType] = easingType;
    }
    if (this.isPictureEasingDefault(pictureId)) {
        delete this._pictureEasings[realPictureId];
    }
};

// ピクチャイージング設定のリセット
Game_Screen.prototype.resetPictureEasing = function(pictureId, motionType) {
    var realPictureId = this.realPictureId(pictureId);
    if (!this.existsPictureEasing(realPictureId)) {
        return;
    }
    this.setPictureEasing(pictureId, motionType, 'linear');
};

// ピクチャイージング設定デフォルト判定
Game_Screen.prototype.isPictureEasingDefault = function(pictureId) {
    var realPictureId = this.realPictureId(pictureId);
    var isDefault = true;
    for (var motionType in this._pictureEasings[realPictureId]) {
        if (this._pictureEasings[realPictureId][motionType] !== 'linear') {
            isDefault = false;
            break;
        }
    }
    return isDefault;
};

// イージング設定パラメータの正誤確認
Game_Screen.prototype.checkEasingParams = function(motionType, easingType) {
    if (!this.isValidMotionType(motionType)) {
        throw new Error(
            pluginName + ": motionType '" + motionType + "' is wrong."
        );
    }
    if (!this.isValidEasingType(easingType)) {
        throw new Error(
            pluginName + ": easingType '" + easingType + "' is wrong."
        );
    }
};

// モーション種別の有効判定
Game_Screen.prototype.isValidMotionType = function(motionType) {
    return !!this.defaultPictureEasing()[motionType] || motionType === 'all';
};

// イージング種別の有効判定
Game_Screen.prototype.isValidEasingType = function(easingType) {
    return !!Easing[easingType];
};

//-----------------------------------------------------------------------------
// Game_Picture
//
// ピクチャ

// オブジェクト初期化
var _Game_Picture_initialize =
    Game_Picture.prototype.initialize;
Game_Picture.prototype.initialize = function() {
    _Game_Picture_initialize.call(this);
    this.initOriginal();
};

// 変更前パラメータの初期化
Game_Picture.prototype.initOriginal = function() {
    this._orgX = this._x;
    this._orgY = this._y;
    this._orgScaleX = this._scaleX;
    this._orgScaleY = this._scaleY;
    this._orgOpacity = this._opacity;
    this._orgDuration = this._duration;
};

// トーンの初期化
var _Game_Picture_initTone =
    Game_Picture.prototype.initTone
Game_Picture.prototype.initTone = function() {
    _Game_Picture_initTone.call(this);
    this._toneOrg = null;
    this._toneOrgDuration = this._toneDuration;
};

// リアルピクチャID
Game_Picture.prototype.realPictureId = function() {
    return $gameScreen.pictures().indexOf(this);
};

// イージング設定
Game_Picture.prototype.easing = function() {
    return $gameScreen.pictureEasing(this.realPictureId());
};

// モーションイージング関数
Game_Picture.prototype.easingFunc = function(motionType) {
    var easingType = this.easing()[motionType];
    return Easing[easingType];
};

// 動作開始
var _Game_Picture_move =
    Game_Picture.prototype.move;
Game_Picture.prototype.move =
    function(origin, x, y, scaleX, scaleY, opacity, blendMode, duration)
{
    _Game_Picture_move.call(
        this, origin, x, y, scaleX, scaleY, opacity, blendMode, duration
    );
    this._orgX = this._x;
    this._orgY = this._y;
    this._orgScaleX = this._scaleX;
    this._orgScaleY = this._scaleY;
    this._orgOpacity = this._opacity;
    this._orgDuration = this._duration;
};

// 染色開始
var _Game_Picture_tint =
    Game_Picture.prototype.tint;
Game_Picture.prototype.tint = function(tone, duration) {
    _Game_Picture_tint.call(this, tone, duration);
    this._toneOrg = this._tone.clone();
    this._toneOrgDuration = this._toneDuration;
};

// 動作の更新
Game_Picture.prototype.updateMove = function() {
    if (this._duration > 0) {
        var durRate = (
            (this._orgDuration - this._duration + 1) /
            this._orgDuration
        );
        var difX = this._targetX - this._orgX;
        var difY = this._targetY - this._orgY;
        var difSclX = this._targetScaleX - this._orgScaleX;
        var difSclY = this._targetScaleY - this._orgScaleY;
        var difOpc = this._targetOpacity - this._orgOpacity;
        this._x = this._orgX + (difX * this.easingFunc('move')(durRate));
        this._y = this._orgY + (difY * this.easingFunc('move')(durRate));
        this._scaleX = this._orgScaleX + (difSclX * this.easingFunc('zoom')(durRate));
        this._scaleY = this._orgScaleY + (difSclY * this.easingFunc('zoom')(durRate));
        this._opacity = this._orgOpacity + (difOpc * this.easingFunc('fade')(durRate));
        this._duration--;
    }
};

// トーンの更新
Game_Picture.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        var durRate = (
            (this._toneOrgDuration - this._toneDuration + 1) /
            this._toneOrgDuration
        );
        for (var i = 0; i < this._tone.length; i++) {
            var dif = this._toneTarget[i] - this._toneOrg[i];
            this._tone[i] = this._toneOrg[i] + (dif * this.easingFunc('tint')(durRate));
        }
        this._toneDuration--;
    }
};

}) ();

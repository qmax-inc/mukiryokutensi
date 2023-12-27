//============================================================================
// BB_FontColorChanger.js
// Copyright (c) 2017 BB ENTERTAINMENT
//============================================================================

/*:
 * @plugindesc デフォルト白の文字色を指定の色に変えるプラグイン。
 * @author ビービー
 *
 * @param FontColorChangeSwitchID
 * @type switch
 * @desc 文字の色を変えるスイッチのID
 * @default 1
 *
 * @param ChangeingColorID
 * @desc 変える文字の色
 * @default 12
 *
 * @help 【プラグインの説明】
 *
 * パラメータで指定したIDのスイッチがONの時
 * デフォルト白の文字色を指定の色に変えるプラグインです。
 *
 * メニュー開閉時に指定したスイッチを自動でON/OFFする機能があります。
 * タイトル画面表示時に指定したスイッチをOFFにします。
 *
 * 【利用規約】
 * このプラグインは、MITライセンスのもとで公開されています。
 * Copyright (c) 2017 BB ENTERTAINMENT
 * Released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 *
 * コンタクト：
 * BB ENTERTAINMENT Twitter: https://twitter.com/BB_ENTER/
 * BB ENTERTAINMENT BLOG   : http://bb-entertainment-blog.blogspot.jp/
 */


(function() {
    'use strict';
//----------------------------------------------------------------------------
// プラグインパラメータ管理
var parameters = PluginManager.parameters('BB_FontColorChanger');
var BBFCCSID = Number(parameters['FontColorChangeSwitchID']);
var BBCCID = Number(parameters['ChangeingColorID']);

var _Window_Base_normalColor = Window_Base.prototype.normalColor;
Window_Base.prototype.normalColor = function() {
    if($gameSwitches.value(BBFCCSID)){
        return this.textColor(BBCCID);
    } else {
        return this.textColor(0);
    }
};

var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
    _Scene_Map_callMenu.call(this);
    $gameSwitches.setValue(BBFCCSID,true);
};

var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('cancel',    this.commandMenuEnd.bind(this));
};

Scene_Menu.prototype.commandMenuEnd = function() {
    if($gameSwitches.value(BBFCCSID)){
        $gameSwitches.setValue(BBFCCSID,false);
    }
    this.popScene();
};

var _Scene_Title_create = Scene_Title.prototype.create;
Scene_Title.prototype.create = function() {
    if($gameSwitches.value(BBFCCSID)){
        $gameSwitches.setValue(BBFCCSID,false);
    }
    _Scene_Title_create.call(this);
};

})();
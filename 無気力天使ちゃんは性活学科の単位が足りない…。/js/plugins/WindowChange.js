//=============================================================================
// WindowChange.js 1.00
//=============================================================================

/*:
 * @plugindesc ウィンドウスキンをゲーム途中で変更できるようにします。
 * @author AWs(蒼井 刹那)
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 　　　ゲーム中にウィンドウスキンを変更することができます。
 * 　　　また、タイトルコマンド、メニューのウィンドウを別に指定することも
 * 　　　できます。
 * 　　　会話イベント(文章のの表示)とメニュー、タイトルでウィンドウスキンを
 * 　　　変えたいときにどうぞ。
 * 
 * 　　　使い方：
 * 　　　プラグインフォルダに入れた後、「プラグイン管理」で各種オプションを
 * 　　　設定してください。
 * 
 * 　　　各種パラメータ説明：
 * 　　　SkinCount　	ウィンドウスキンの枚数(末尾の番号)を指定します。
 * 　　　　　　　　 	Window0～3まである時は「3」になります
 * 　　　SkinId　　 	ウィンドウスキンを管理する変数IDを指定します。
 * 　　　SkinChangeId　 マップ上のウィンドウスキンを管理する変数IDを指定します。
 * 　　　MSkinChangeId　メニューのウィンドウスキンの管理する変数IDを指定します。
 * 　　　TSkin　　　	タイトルコマンドのウィンドウスキンのIDを指定します。
 *
 * 　　　ウィンドウスキンの変更のしかた：
 * 　　　まず、プロジェクトフォルダ内img/systemフォルダに必要な
 * 　　　ウィンドウスキン「Window.png」「Window0.png」「Window1.png」...と
 * 　　　「0から連番で」用意しておきます。
 * 　　　「プラグイン管理」で各種変数、パラメータを変更します。
 * 　　　ゲーム中でウィンドウスキンを変更するときはイベントコマンド
 * 　　　「変数の管理」で指定したIDの変数に変更したいウィンドウスキンの番号を
 * 　　　入力してください。
 * 　　　
 * 　　　注意事項：
 * 　　　使用するウィンドウスキンのファイル名は必ず0～の連番にしてください。
 * 　　　タイトルコマンドのウィンドウスキンは変更できません。
 * 　　　「Window.png」は削除しないでください。
 *
 *
 * @param SkinCount
 * @desc ウィンドウスキンの枚数を指定します
 * @default 3
 *
 * @param SkinId
 * @desc ウィンドウスキン変更に使用する変数IDを指定します
 * @default 1
 *
 * @param SkinChangeId
 * @desc マップ上でのウィンドウスキン管理に使用する変数IDを指定します
 * @default 2
 *
 * @param MSkinChangeId
 * @desc メニューのウィンドウスキン管理に使用する変数IDを指定します
 * @default 3
 *
 * @param TSkin
 * @desc タイトルコマンドで使用するウィンドウスキンのIDを指定します
 * @default 1
 *
 */

(function() {
	
var parameters = PluginManager.parameters('WindowChange');
var SCount = Number(parameters['SkinCount'] || 0);
var SId = Number(parameters['SkinId'] || 0);
var SCId = Number(parameters['SkinChangeId'] || 0);
var MCId = Number(parameters['MSkinChangeId'] || 0);
var TSet = Number(parameters['TSkin'] || 0);

var _Scene_Boot_prototype_loadSystemWindowImage = Scene_Boot.prototype.loadSystemWindowImage;
	Scene_Boot.prototype.loadSystemWindowImage = function() {
	for (var LCount=0 ; LCount<=SCount ; LCount++){
    ImageManager.loadSystem('Window' + LCount);
}
};

var _Window_Base_prototype_update = Window_Base.prototype.update;
	Window_Base.prototype.update = function() {
    _Window_Base_prototype_update.call(this);
    this.windowskin = ImageManager.loadSystem("Window" + $gameVariables.value(SId));
    this.updateTone();
    this.updateOpen();
    this.updateClose();
    this.updateBackgroundDimmer();
};

var _Window_Base_prototype_close = Window_Base.prototype.close;
	Window_Base.prototype.close = function() {
    _Window_Base_prototype_close.call(this);
	$gameVariables.setValue(SId,TSet);
    if (!this.isClosed()) {
        this._closing = true;
    }
    this._opening = false;
};

var _Scene_Title_prototype_start = Scene_Title.prototype.start;
	Scene_Title.prototype.start = function() {
    _Scene_Title_prototype_start.call(this);
    SceneManager.clearStack();
	$gameVariables.setValue(SId,TSet);
    this.centerSprite(this._backSprite1);
    this.centerSprite(this._backSprite2);
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
	Scene_Title.prototype.createCommandWindow.call(this);
};

var _Scene_Map_prototype_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
    _Scene_Map_prototype_start.call(this);
    SceneManager.clearStack();
	if (SId){
	$gameVariables.setValue(SId,$gameVariables.value(SCId));
	}
    if (this._transfer) {
        this.fadeInForTransfer();
        this._mapNameWindow.open();
        $gameMap.autoplay();
    } else if (this.needsFadeIn()) {
        this.startFadeIn(this.fadeSpeed(), false);
    }
    this.menuCalling = false;
};

var _Scene_Map_prototype_callMenu = Scene_Map.prototype.callMenu;
	Scene_Map.prototype.callMenu = function() {
    _Scene_Map_prototype_callMenu.call(this);
	$gameVariables.setValue(SId,$gameVariables.value(MCId));
	SoundManager.playOk();	
    SceneManager.push(Scene_Menu);
    Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};

var _Scene_Load_prototype_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
Scene_Load.prototype.onLoadSuccess = function() {
    _Scene_Load_prototype_onLoadSuccess.call(this);
    SoundManager.playLoad();
	$gameVariables.setValue(SId,TSet);
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

})();

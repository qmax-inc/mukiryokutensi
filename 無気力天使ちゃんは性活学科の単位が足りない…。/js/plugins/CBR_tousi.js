/*
############################################
	作者: COBRA
	改造や配布しても大丈夫だよ
	寧ろ積極的に配布して皆のゲーム快適にして
	http://cobrara.blogspot.jp/
############################################
*/

/*:
* @plugindesc 下着が見えるプラグイン
* @author COBRA
* @help Version 1.0.0
* 2018/4/1
*
* ピクチャを表示→スクリプトで
*
* CBR-tousi-start
* ピクチャ番号 = ピクチャ番号
* 画像 = 画像名
*
* または
* CBR.tousi.start(ピクチャ番号,"画像名");
*
*
* ピクチャ番号：透視したいピクチャの番号
* 画像名：透視した時下に見える画像
*
*
*
* 透視を終わらせたい→スクリプトを使って終了させます
*
*
*
* CBR-scan-end
* number = ピクチャ番号
*
* または
* CBR.scan.end(ピクチャ番号);
*
* CBR-scan-end
* CBR.scan.end()
* で一括終了
*
*
* 覗き穴画像はimg/pictureに保存してください
*
* 覗き穴画像に変数名を使いたい時は
* 画像名\\V[n] の形にしてください
*
*
*
* @param 覗き穴画像
* @desc 覗き穴画像、変数も使えます
* Default: CBR_maru
* @default CBR_maru
*/

var CBR = CBR || {};
CBR.tousi = {};


if(!CBR_Game_Interpreter_command355){
	var CBR_Game_Interpreter_command355 = Game_Interpreter.prototype.command355;

	Game_Interpreter.prototype.command355 = function() {
		//CBR-xxxの場合CBR.xxxにobjを渡す
		var key = this.currentCommand().parameters[0];
		if(key.match(/^CBR\-/)){
			var obj = {};
			var cnt = 0;
			while (this.nextEventCode() === 655) {
				cnt++;
				this._index++;
				var temp = this.currentCommand().parameters[0].match(/([^\=]+)\=(.+)/);
				obj[temp[1].trim()] = temp[2].trim();
			}
			var temp = key.split('-');
			if(!cnt){
				CBR[temp[1]][temp[2]]();
			}else{
				CBR[temp[1]][temp[2]](obj);
			}
		}else{
			CBR_Game_Interpreter_command355.call(this);
		}
		return true;
	};
}


(function(){

	var CBR_Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function(){
		CBR_Game_System_initialize.call(this);
	
		this._CBR_scan = [];
	};
	//ロード時
	var CBR_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
	Game_System.prototype.onAfterLoad = function() {
		CBR_Game_System_onAfterLoad.call(this);
	
		this._CBR_scan = this._CBR_scan || [];
	};
	
	
	//透視開始
	CBR.tousi.start = function(obj,b){
		if(typeof obj=='object'){
			$gameSystem.CBR_scan(Number(obj['ピクチャ番号']),obj['画像']);
		}else{
			$gameSystem.CBR_scan(obj,b);
		}
	};
	Game_System.prototype.CBR_scan = function(num,img){
		this._CBR_scan[0] ={
			'num':num,
			'lingerie':img,
			'circle':PluginManager.parameters('CBR_tousi')['覗き穴画像'],
			'del':null
		};
	};
	
	//透視停止
	CBR.tousi.end = function(num){
		$gameSystem.CBR_scanEnd(num);
	};
	Game_System.prototype.CBR_scanEnd = function(num){
		this._CBR_scan[0].del = true;
	};
	
	
	var CBR_Scene_Map_updateMain = Scene_Map.prototype.updateMain;
	Scene_Map.prototype.updateMain = function() {
		CBR_Scene_Map_updateMain.call(this);//この位置を変えればメニューはなんとか
	
		var data = $gameSystem._CBR_scan[0];

		if(data){
			//プラグインコマンドで直接がいいけど　ここで消そう thisで消したいだけ　あとスクリプトで消してその後アップデート実行されない場合もあるかもしれないし
			if(data.del){
				var CBR_sp = this._spriteset._pictureContainer.children[data.num-1]
				CBR_sp.removeChildren();
				//delete data;
				$gameSystem._CBR_scan.splice(0, 1);
			}else{
				var pic = $gameScreen.picture(data.num);

				if(pic){
					var x = pic.x();
					var y = pic.y();
	
					var CBR_sp = this._spriteset._pictureContainer.children[data.num-1];//ピクチャ番号-1したスプライトが入ってる
					CBR_sp.removeChildren();
		
					//枠組みを作る
					var wrap_dummy = new PIXI.Sprite();
	
					//直接xを変更したらアカンので
					var map_dummy = new PIXI.Sprite();
					var temp = Object.assign(new Sprite,this._spriteset.children[0]);//children[0]がマップのみ
					map_dummy.addChild(temp);
					map_dummy.x -= x;
					map_dummy.y -= y;
					wrap_dummy.addChild(map_dummy);
			
					//裸も追加 本当はサークルもここもPIXI.でやりたいけど暗号化の処理とbitmapの追加方法がよくわからんから
	//				var nude = new PIXI.Sprite(
	//					PIXI.Texture.fromImage('./img/pictures/'+this.CBR_scan.lingerie+'.png')
	//				);
					var nude = new Sprite();
					nude.bitmap = ImageManager.loadPicture(data.lingerie);
					wrap_dummy.addChild(nude);
	
					//円でマスクする
					var temp = data.circle;
					//変数処理
					temp = temp.replace(/\\\\V\[(\d+)\]/g,function(a,b){
						return $gameVariables.value(b);
					});
	
					var circle = new Sprite();
					circle.bitmap = ImageManager.loadPicture(temp);
	
					circle.x = TouchInput._CBR_x - x - circle.width/2;
					circle.y = TouchInput._CBR_y - y - circle.width/2;
					wrap_dummy.mask = circle;
					wrap_dummy.addChild(circle);
			
					//ピクチャと合流させる
					CBR_sp.addChild(wrap_dummy);
				}
			}
		}
	};
})();

if(!CBR_TouchInput_onMouseMove){
	var CBR_TouchInput_onMouseMove = TouchInput._onMouseMove;
	TouchInput._onMouseMove = function(event) {
		var x = Graphics.pageToCanvasX(event.pageX);
		var y = Graphics.pageToCanvasY(event.pageY);
		this._CBR_onRealMove(x, y);
	
		CBR_TouchInput_onMouseMove.call(this,event);
	};

	TouchInput._CBR_onRealMove = function(x, y) {
	//	this._events.CBR_moved = true;　必要ないかな　常に変更されてるし
		this._CBR_x = x;
		this._CBR_y = y;
	};
}
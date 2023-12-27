/*:

 * @plugindesc アイテムリスト、スキルリスト等の列数を改変します

 * @author ハーリー


 * @param ItemListCols
 * @desc アイテムリストの列数です。
 * @default 3

 * @param ItemFontSize
 * @desc アイテムリストのフォントサイズです。Default:28
 * @default 20

 * @param SkillListCols
 * @desc スキルリストの列数です。
 * @default 3

 * @param SkillFontSize
 * @desc スキルリストのフォントサイズです。Default:28
 * @default 20

 * @param ShopListCols
 * @desc ショップの購入リストの列数です。2以上の時、ステータスウィンドウが幅寄せされます
 * @default 2

 * @param ShopListFontSize
 * @desc ショップの購入リストのフォントサイズです。Default:28
 * @default 20

 * @param EquipListCols
 * @desc 装備画面時のアイテムの列数です。
 * @default 3

 * @help
 * アイテムリスト、スキルリスト、ショップの購入リストの列数を増やします。

 *列数を増やすことで、リストをスクロールする手間を軽減したり、
 *3段活用形のスキルなどを一行に表示したりすることができます。
 *
 *Author ハーリー
 *Version 1.00:2016.3.14
 *Version 1.01:2016.3.15　パラメータにEquipListColsを追加

 */



(function(){


var parameters = PluginManager.parameters('Hurry_ListColsPlus');
var ItemListCols = Number(parameters['ItemListCols']);
var ItemFontSize = Number(parameters['ItemFontSize']);
var SkillListCols = Number(parameters['SkillListCols']);
var SkillFontSize = Number(parameters['SkillFontSize']);
var ShopListCols = Number(parameters['ShopListCols']);
var ShopListFontSize = Number(parameters['ShopListFontSize']);
var EquipListCols = Number(parameters['EquipListCols']);

Window_ItemList.prototype.maxCols = function() {

	return ItemListCols;

};
     

Window_ItemList.prototype.spacing = function() {
	return 9;
};
Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
	this.contents.fontSize = ItemFontSize;
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};   
    
Window_ItemList.prototype.numberWidth = function() {
    return this.textWidth('\u00d70,0');
};

Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.changeTextColor(this.systemColor());
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

Window_SkillList.prototype.maxCols = function() {

	return SkillListCols;
   
};
Window_SkillList.prototype.spacing = function() {
	return 9;
};
Window_SkillList.prototype.drawItem = function(index) {
    var skill = this._data[index];
    if (skill) {
        var costWidth = this.costWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
	this.contents.fontSize = SkillFontSize;
        this.changePaintOpacity(this.isEnabled(skill));
        this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};
Window_SkillList.prototype.costWidth = function() {
    return this.textWidth('\u00d70,0');
};

Window_EquipItem.prototype.maxCols = function() {

	return EquipListCols;

};

if(ShopListCols>1){
Window_ShopBuy.prototype.maxCols = function() {
    return ShopListCols;
};
Window_ShopBuy.prototype.windowWidth = function() {
    return 576;
};

Scene_Shop.prototype.createStatusWindow = function() {
    var wx = this._numberWindow.width+120;
    var wy = this._dummyWindow.y;
    var ww = Graphics.boxWidth - wx;
    var wh = this._dummyWindow.height;
    this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
    this._statusWindow.hide();
    this.addWindow(this._statusWindow);
};
}
Window_ShopBuy.prototype.drawItem = function(index) {
    var item = this._data[index];
    var rect = this.itemRect(index);
    var priceWidth = 96;
    rect.width -= this.textPadding();
　　this.contents.fontSize = ShopListFontSize;
    this.changePaintOpacity(this.isEnabled(item));
    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
　　this.changeTextColor(this.systemColor());
    this.drawText(this.price(item), rect.x + rect.width - priceWidth,rect.y, priceWidth, 'right');
    this.changePaintOpacity(true);
};

Window_ShopStatus.prototype.drawPossession = function(x, y) {
    var width = this.contents.width - this.textPadding() - x;
    var possessionWidth = this.textWidth('\u00d70,0');
    this.contents.fontSize = ShopListFontSize;
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.possession, x, y, width-possessionWidth);
    this.resetTextColor();
    this.drawText($gameParty.numItems(this._item), x, y, width, 'right');
};

Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
    var enabled = actor.canEquip(this._item);
    var width = this.contents.width - this.textPadding() - x;
    var possessionWidth = this.textWidth('\u00d70');
    this.changePaintOpacity(enabled);
    this.resetTextColor();
    this.contents.fontSize = ShopListFontSize;
    this.drawText(actor.name(), x, y, 168);
    var item1 = this.currentEquippedItem(actor, this._item.etypeId);
    if (enabled) {
        this.drawActorParamChange(x, y, actor, item1);
    }
    this.drawItemName(item1, x, y + this.lineHeight(),width-possessionWidth);
    this.changePaintOpacity(true);
};
})();

//===============create Game==================
myGame.init(1600,1200,5);

//===============add Sound==================

//===============create Scene================
myGame.sceneManager.createScenes(2);

//===============create States================
myGame.initStateManager({});
var reaction = myGame.reactionSystem;

//===============create Objects==================

var _background_7= Alice.Object.fromImage('./Resources/Assets/room_basic.png');
_background_7.name = '_background_7';
_background_7.anchor.set(0.5, 0.5);
_background_7.x = 745.1041666666667;
_background_7.y = 593.3333333333334;
_background_7.scale.set(1.6666666666666667, 1.6666666666666667);
reaction.makeUnClickable( _background_7 );
reaction.makeUnDraggable( _background_7 );
_background_7.visible = true;
myGame.scene(0).addChild(_background_7);

var _librarian_3= Alice.Object.fromImage('./Resources/Assets/mad_hat.png');
_librarian_3.name = '_librarian_3';
_librarian_3.anchor.set(0.5, 0.5);
_librarian_3.x = 264.21875;
_librarian_3.y = 640;
_librarian_3.scale.set(1.6666666666666667, 1.6666666666666667);
reaction.makeClickable( _librarian_3 );
reaction.makeUnDraggable( _librarian_3 );
_librarian_3.visible = true;
myGame.scene(0).addChild(_librarian_3);

var _book_6= Alice.Object.fromImage('./Resources/Assets/book.png');
_book_6.name = '_book_6';
_book_6.anchor.set(0.5, 0.5);
_book_6.x = 1285.1041666666667;
_book_6.y = 426.6666666666667;
_book_6.scale.set(1.1102744310575636, 1.1003236245954693);
reaction.makeClickable( _book_6 );
reaction.makeUnDraggable( _book_6 );
_book_6.visible = true;
myGame.scene(0).addChild(_book_6);

var _Kitchen_11= Alice.Object.fromImage('./Resources/Assets/kitchen.png');
_Kitchen_11.name = '_Kitchen_11';
_Kitchen_11.anchor.set(0.5, 0.5);
_Kitchen_11.x = 856.6666666666667;
_Kitchen_11.y = 600;
_Kitchen_11.scale.set(1.6666666666666667, 1.6666666666666667);
reaction.makeUnClickable( _Kitchen_11 );
reaction.makeUnDraggable( _Kitchen_11 );
_Kitchen_11.visible = true;
myGame.scene(1).addChild(_Kitchen_11);

var _janitor_9= Alice.Object.fromImage('./Resources/Assets/robot.png');
_janitor_9.name = '_janitor_9';
_janitor_9.anchor.set(0.5, 0.5);
_janitor_9.x = 720;
_janitor_9.y = 810;
_janitor_9.scale.set(2.792022792022792, 2.6976744186046515);
reaction.makeClickable( _janitor_9 );
reaction.makeUnDraggable( _janitor_9 );
_janitor_9.visible = true;
myGame.scene(1).addChild(_janitor_9);

var _Whitecone_10= Alice.Object.fromImage('./Resources/Assets/whitecone.png');
_Whitecone_10.name = '_Whitecone_10';
_Whitecone_10.anchor.set(0.5, 0.5);
_Whitecone_10.x = 1326.6666666666667;
_Whitecone_10.y = 980;
_Whitecone_10.scale.set(2.7106227106227108, 2.916666666666667);
reaction.makeClickable( _Whitecone_10 );
reaction.makeUnDraggable( _Whitecone_10 );
_Whitecone_10.visible = true;
myGame.scene(1).addChild(_Whitecone_10);

var _Doorkitchen_12= Alice.Object.fromImage('./Resources/Assets/door.png');
_Doorkitchen_12.name = '_Doorkitchen_12';
_Doorkitchen_12.anchor.set(0.5, 0.5);
_Doorkitchen_12.x = 340;
_Doorkitchen_12.y = 626.6666666666667;
_Doorkitchen_12.scale.set(1.6666666666666667, 1.6666666666666667);
reaction.makeClickable( _Doorkitchen_12 );
reaction.makeUnDraggable( _Doorkitchen_12 );
_Doorkitchen_12.visible = true;
myGame.scene(1).addChild(_Doorkitchen_12);

var _Doorlibrary_14= Alice.Object.fromImage('./Resources/Assets/door.png');
_Doorlibrary_14.name = '_Doorlibrary_14';
_Doorlibrary_14.anchor.set(0.5, 0.5);
_Doorlibrary_14.x = 663.3333333333334;
_Doorlibrary_14.y = 600;
_Doorlibrary_14.scale.set(1.6666666666666667, 1.6666666666666667);
reaction.makeClickable( _Doorlibrary_14 );
reaction.makeUnDraggable( _Doorlibrary_14 );
_Doorlibrary_14.visible = true;
myGame.scene(0).addChild(_Doorlibrary_14);

var _Table_13= Alice.Object.fromImage('./Resources/Assets/table.png');
_Table_13.name = '_Table_13';
_Table_13.anchor.set(0.5, 0.5);
_Table_13.x = 1136.6666666666667;
_Table_13.y = 803.3333333333334;
_Table_13.scale.set(1.4157014157014156, 1.4093959731543624);
reaction.makeUnClickable( _Table_13 );
reaction.makeUnDraggable( _Table_13 );
_Table_13.visible = true;
myGame.scene(0).addChild(_Table_13);


//================interaction=====================

//-------------USE--------------
myGame.eventSystem.addUsedEvent(_book_6, _janitor_9, function(){
	myGame.messageBox.startConversation(['Thank you!'], function(){
		});//messageBox end
}); //interaction end

//--------------Click--------------
_Doorkitchen_12.DIY_CLICK = function(){
	reaction.transitToScene(0);
}//interaction end

//--------------Click--------------
_book_6.DIY_CLICK = function(){
	reaction.addToInventory(_book_6);
}//interaction end

//--------------Click--------------
_Doorlibrary_14.DIY_CLICK = function(){
	reaction.transitToScene(1);
}//interaction end

myGame.start(0);
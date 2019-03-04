'use strict';

//const {MENU} = require('./Utilities/Utilities');
const File = require('./File');

var Menu;

Menu = {
	menu: null,
	template: [], 
	Init(){}, 
	Update(){}
};

// static 
Menu.template = [
	{
		label: 'File', 
		submenu: [
			{ label: 'New project', click(){File.NewProject();} }, 
			{ label: 'Open project', click(){File.OpenProject();} },
			{ label: 'Save project', click(){File.SaveProject();} }, 
			{ label: 'Save as new project', click(){File.SaveAsNewProject();} }, 
			{ label: 'Close project', click(){File.CloseProject();} }, 

			{ type: 'separator'}, 
			{ label: 'Build project', click(){File.BuildProject();} }, 
			{ label: 'Run project', click(){File.RunProject();} }
		]
	},
	{
		label: 'Edit',
		submenu: [
			{ label: 'Undo' },
			{ label: 'Redo' },

			{ type: 'separator' },
			{ label: 'Cut' },
			{ label: 'Copy' },
			{ label: 'Paste' },
			{ label: 'Delete' }
		]
    },

];

Menu.Init = function(){
	Menu.menu = MENU.getApplicationMenu();
	// test
	Menu.template = Menu.menu.items;
	Menu.template[0] = {
		label: 'File', 
		submenu: [
			{ label: 'New project', click(){File.NewProject();} }, 
			{ label: 'Open project', click(){File.OpenProject();} },
			{ label: 'Save project', click(){File.SaveProject();} }, 
			{ label: 'Save as new project', click(){File.SaveAsNewProject();} }, 
			{ label: 'Close project', click(){File.CloseProject();} }, 

			{ type: 'separator'}, 
			{ label: 'Build project', click(){File.BuildProject();} }, 
			{ label: 'Run project', click(){File.RunProject();} }, 

			{ type: 'separator'}, 
			{ label: 'Import sound', click(){File.ImportSound();} },
		]
	}
}

Menu.Update = function(){
	MENU.setApplicationMenu(MENU.buildFromTemplate(Menu.template));	
}

module.exports = Menu;
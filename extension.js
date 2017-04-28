// Send windows one workspace down by rightclick
// (C) 2017 Christoph "criztovyl" Schulz
// GPLv3 and later
const Main = imports.ui.main;
const WindowClone = imports.ui.workspace.WindowClone;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Prefs = Me.imports.prefs;

let winInject = {}, settings;

// gnome-shell-extensions/extensions/windowsNaviagator/extension.js injectToFunction
function injectToFunction(parent, name, func) {
    let origin = parent[name];
    parent[name] = function() {
        let ret;
        ret = func.apply(this, arguments);
        if (ret === undefined){
            log("origin");
            ret = origin.apply(this, arguments);
        }
        return ret;
    }
    return origin;
}

// gnome-shell-extensions/extensions/windowsNaviagator/extension.js
function removeInjection(object, injection, name) {
    if (injection[name] === undefined)
        delete object[name];
    else
        object[name] = injection[name];
}

function init() { 
    settings = Convenience.getSettings();
}

function enable() {

    log('Enabeling rcd');

    winInject['_onClicked'] = injectToFunction(WindowClone.prototype, '_onClicked', function(action, actor){
        if(action.get_button() == 3){ // cycle
            // right click
            let mWin = this.realWindow.get_meta_window(),
                workspaceNr = mWin.get_workspace().index() + 1;

            log("rcd","nr", workspaceNr, "n_workspaces", global.screen.n_workspaces);

            if(workspaceNr == global.screen.n_workspaces)
                workspaceNr = 0;

            mWin.change_workspace_by_index(workspaceNr, false);

            if(settings.get_boolean(Prefs.SETTING_OVERLAY_CLOSE)){
                this._selected = true
                Main.overview.toggle();
            }

        }
    });

    log('Enabeled rcd');
}

function disable() {
    log('Disabeling rcd')
    removeInjection(WindowClone.prototype, winInject, '_onClicked');
    log('Disabeled rcd')
}

// Send windows one workspace down by rightclick
// (C) 2017, 2020, 2021 Christoph "criztovyl" Schulz
// GPLv3 and later
const Main = imports.ui.main;
const { WindowPreview } = imports.ui.windowPreview;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Prefs = Me.imports.prefs;

const { GObject } = imports.gi;

let winInject = {}, settings;

// gnome-shell-extensions/extensions/windowsNaviagator/extension.js injectToFunction
function injectToFunction(parent, name, func) {
    let origin = parent[name];
    parent[name] = function() {
        let ret;
        ret = func.apply(this, arguments);
        if (ret === undefined){
            ret = origin.apply(this, arguments);
        }
        return ret;
    }
    return origin;
}

function appendToFunction(parent, name, func) {
    let origin = parent[name];
    parent[name] = function() {
        let ret;
        ret = origin.apply(this, arguments);
        func.apply(this, arguments);
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

    winInject['_init'] = appendToFunction(WindowPreview.prototype, "_init", function(){

        // clickAction = Main.overview.viewSelector._workspacesDisplay._workspacesViews[1]._workspaces[0]._windows[0].get_actions()[0]

        let clickAction = this.get_actions().find(a => GObject.type_name(a) == "ClutterClickAction")

        let clickHandlerId = GObject.signal_handler_find(clickAction, {signalId: "clicked"})
        clickAction.disconnect(clickHandlerId)

        clickAction.connect("clicked", function(action, actor){

            log("rcd", "clicked", this)

            if(action.get_button() == 3){ // right click

                let mWin = this._windowActor.get_meta_window(),
                    workspaceNr = mWin.get_workspace().index() + 1,
                    n_workspaces = global.workspace_manager.n_workspaces;

                log("rcd", "nr", workspaceNr, "n_workspaces", n_workspaces);

                // cycle
                if(workspaceNr == n_workspaces) // cycle
                    workspaceNr = 0;

                mWin.change_workspace_by_index(workspaceNr, false);

                if(settings.get_boolean(Prefs.SETTING_OVERLAY_CLOSE)){
                    this._selected = true; // cancel d'n'd event
                    Main.overview.toggle();
                }

            } else {
                if(this._activate != undefined){
                    this._activate()
                } else {
                    this._onClicked(action, actor)
                }
            }
        }.bind(this))

    })

    log('Enabeled rcd');
}

function disable() {
    log('Disabeling rcd')
    removeInjection(WindowPreview.prototype, winInject, '_init');
    log('Disabeled rcd')
}

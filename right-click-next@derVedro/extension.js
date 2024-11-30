// Send window to the next workspace by rightclick
// (C) 2017, 2020, 2021 Christoph "criztovyl" Schulz
// (C) 2024 derVedro
// GPLv3 and later

import {WindowPreview} from 'resource:///org/gnome/shell/ui/windowPreview.js';
import GObject from 'gi://GObject';
import {
    Extension,
    InjectionManager
} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class RightClickNext extends Extension {

    enable() {
        this._injectionManager = new InjectionManager();
        this._injectionManager.overrideMethod(WindowPreview.prototype, "_init",
            originalMethod => {
                return function (...args){
                    originalMethod.call(this, ...args);

                    let clickAction = this.get_actions().find(a => GObject.type_name(a) == "ClutterClickAction");
                    let clickHandlerId = GObject.signal_handler_find(clickAction, {signalId: "clicked"});
                    clickAction.disconnect(clickHandlerId);
                    clickAction.connect("clicked", function (action, actor) {
                        if (action.get_button() == 3) { // right click
                            let mWin = this._windowActor.get_meta_window(),
                                workspaceNr = mWin.get_workspace().index() + 1,
                                n_workspaces = global.workspace_manager.n_workspaces;
                            if (workspaceNr == n_workspaces) // cycle
                                workspaceNr = 0;
                            mWin.change_workspace_by_index(workspaceNr, false);

                        } else {
                            if (this._activate != undefined) {
                                this._activate();
                            } else {
                                this._onClicked(action, actor);
                            }
                        }
                    }.bind(this));
                }
            });
    }

    disable() {
        this._injectionManager.clear();
        this._injectionManager = null;
    }

}

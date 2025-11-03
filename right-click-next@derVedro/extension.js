// Send window to the next workspace by rightclick
// (C) 2017, 2020, 2021 Christoph "criztovyl" Schulz
// (C) 2024, 2025 derVedro
// GPLv3 and later

import Clutter from 'gi://Clutter';
import {
    Extension,
    InjectionManager
} from 'resource:///org/gnome/shell/extensions/extension.js';
import { Workspace } from 'resource:///org/gnome/shell/ui/workspace.js';

export default class RightClickNext extends Extension {
    #injectionManager;

    enable() {
        this.#injectionManager = new InjectionManager();
        this.#patchClickHandler();
    }

    disable() {
        this.#injectionManager.clear();
        this.#injectionManager = null;
    }

    #patchClickHandler() {
        // Patch _addWindowClone to override click handler for window clones (window previews).
        this.#injectionManager.overrideMethod(Workspace.prototype, '_addWindowClone',
            original => function () {
                let clone = original.apply(this, arguments);

                clone.connect('captured-event', (_actor, event) => {
                    if (event.type() === Clutter.EventType.BUTTON_RELEASE) {
                        if (event.get_button() === 3) {  // Right click
                            const metaWindow = clone.metaWindow;
                            const currentWorkspace = metaWindow.get_workspace();
                            const workspaceManager = global.workspace_manager;

                            let currentIndex = currentWorkspace.index();
                            let workspaceCount = workspaceManager.n_workspaces;

                            let nextIndex = (currentIndex + 1) % workspaceCount;
                            let nextWorkspace = workspaceManager.get_workspace_by_index(nextIndex);

                            // Move the window to the next workspace
                            metaWindow.change_workspace(nextWorkspace);

                            // Optionally, focus on the moved window
                            metaWindow.focus(global.get_current_time());
                        }
                    }
                });

                return clone;
            }
        );
    }
};
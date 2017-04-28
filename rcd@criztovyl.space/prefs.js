/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// Send windows one workspace down by rightclick
// (C) 2017 Christoph "criztovyl" Schulz
// GPLv3 and later
//
// Code adapted from gnome-shell-extension example extension
//   https://git.gnome.org/browse/gnome-shell-extensions/tree/extensions/example
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

//const Gettext = imports.gettext.domain('right-click-down');
//const _ = Gettext.gettext;
const N_ = function(e) { return e };
const _ = N_;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const SETTING_OVERLAY_CLOSE = 'overlay-close';

const RightClickDownSettingsWidget = new GObject.Class({
    Name: 'RightClickDown.Prefs.RightClickDownSettingsWidget',
    GTypeName: 'RightClickDownSettingsWidget',
    Extends: Gtk.Grid,

    _init : function(params) {
        this.parent(params);
        this.margin = 24;
        this.row_spacing = 6;
        this.orientation = Gtk.Orientation.VERTICAL;

        this._settings = Convenience.getSettings();


        let cbOverlay = new Gtk.CheckButton({ label: _('Close Overlay after click'), margin_top: 6 });
        this._settings.bind(SETTING_OVERLAY_CLOSE, cbOverlay, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.add(cbOverlay);
    },
});

function init() {
    //Convenience.initTranslations();
}

function buildPrefsWidget() {
    let widget = new RightClickDownSettingsWidget();
    widget.show_all();

    return widget;
}

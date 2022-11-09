/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"tra03_05/epm03_05/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

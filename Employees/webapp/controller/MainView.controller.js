sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";

        var Main = Controller.extend("logaligroup.Employees.controller.MainView", {});
		Main.prototype.onInit = function () { };
        Main.prototype.onLiveChange = function () {                
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();                 
                //var mOK = oResourceBundle.getText("textOK");
                //var mNOK = oResourceBundle.getText("textNotOK");

                var idEmp = this.byId("inputEmployee");
                var valueEmp = idEmp.getValue();

                if (valueEmp.length === 6) {
                //    idEmp.setDescription(mOK);
                    this.byId("slCountry").setVisible(true);
                    this.byId("labelCountry").setVisible(true);
                }else{
                //    idEmp.setDescription(mNOK);
                    this.byId("slCountry").setVisible(false);
                    this.byId("labelCountry").setVisible(false);                
                }
            };

		return Main;
	});

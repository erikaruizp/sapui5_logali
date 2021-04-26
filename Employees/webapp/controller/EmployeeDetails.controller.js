//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {

    function onInit() {
        var oView = this.getView().getModel("jsonEmployee");
    }

    var Main = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});

    Main.prototype.onInit = onInit;

    return Main;
});    
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.routing.History} History
     */
    function (Controller,History) {
        function _onObjectMatch(oEvent) {
            this.getView().bindElement({
                path: '/Orders(' + oEvent.getParameter("arguments").OrderID + ')',
                model: 'odataNorthwind'
            });
        }
        return Controller.extend("logaligroup.Employees.controller.OrderDetails", {
            onInit: function () { 
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatch, this);
            },
            onBack: function (oEvent) {
                var oHistory = History.getInstance();
                var sPrevHash = oHistory.getPreviousHash();

                if (sPrevHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain", true);
                }
            }
        });
}); 
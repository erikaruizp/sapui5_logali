//@ts-nocheck
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
            },
            onClearSignature: function (oEvent) {
                var firma = this.byId("signature");
                firma.clear();
            },
            factoryOrderDetails: function (listId,oContext) {
                var objeto = oContext.getObject();
                objeto.currency = "EUR";
                var unitInStock = oContext.getModel().getProperty("/Products(" + objeto.ProductID + ")/UnitsInStock");

                if (objeto.Quantity <= unitInStock) {
                    var oListItem = new sap.m.ObjectListItem({
                        title: "{odataNorthwind>/Products(" + objeto.ProductID + ")/ProductName} (" + objeto.Quantity + ")",
                        number:"{parts: [{path: 'odataNorthwind>UnitPrice'},{path: 'odataNorthwind>currency'}]," +
                               " type: 'sap.ui.model.type.Currency', " +
                               " formatOptions: {showMeasure: false}" +
                               "}",
                        numberUnit: "{odataNorthwind>currency}",
                    });
                    return oListItem;
                } else {
                    var oCustomListItem = new sap.m.CustomListItem({
                        content: [
                            new sap.m.Bar({
                                contentLeft: new sap.m.Label({
                                    text:"{odataNorthwind>/Products(" + objeto.ProductID + ")/ProductName} (" + objeto.Quantity + ")"
                                }),
                                contentMiddle: new sap.m.ObjectStatus({
                                    text:"{i18n>availStockTitle} " + unitInStock,
                                    state:"Error" 
                                }),
                                contentRight: new sap.m.Label({
                                    text: "{parts: [{path: 'odataNorthwind>UnitPrice'},{path: 'odataNorthwind>currency'}]," +
                                          " type: 'sap.ui.model.type.Currency' " +
                                          "}"
                                })
                            })
                        ]
                    });
                    return oCustomListItem;
                }
            }
        });
}); 
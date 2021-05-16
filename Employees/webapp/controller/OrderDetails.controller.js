//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.routing.History} History
     */
    function (Controller,History,MessageBox) {
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
            },
            onSaveSignature: function (oEvent) {
                const firma = this.byId("signature");
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let firmaPNG;

                if (!firma.isFill()) {
                    MessageBox.error(oResourceBundle.getText("msgFillSignature"));
                } else {
                    firmaPNG = firma.getSignature().replace("data:image/png;base64,","");
                    let objOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                    let body = {
                        OrderId: objOrder.OrderID.toString(),
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId:  objOrder.EmployeeID.toString(),
                        MediaContent: firmaPNG,
                        MimeType: "image/png"
                    };
                    this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                        success: function () {
                            MessageBox.information(oResourceBundle.getText("msgSignatureSaved")); 
                        },
                        error: function () {
                            MessageBox.error(oResourceBundle.getText("msgSignatureNotSaved"));
                        }
                    });
                };
            }
        });
}); 
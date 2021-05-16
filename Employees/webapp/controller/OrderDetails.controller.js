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
            this.onClearSignature();
            this.getView().bindElement({
                path: '/Orders(' + oEvent.getParameter('arguments').OrderID + ')',
                model: 'odataNorthwind',
                events: {
                    dataReceived: function(oData) {
                        _readSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                    }.bind(this)
                }
            });

           let objeto = this.getView().getModel("odataNorthwind").getContext("/Orders(" + oEvent.getParameter("arguments").OrderID + ")").getObject();
           if(objeto){
            _readSignature.bind(this)(objeto.OrderID, objeto.EmployeeID);
            }
        };

        function _readSignature(orderId,employeeId) {
            this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='" + orderId + 
                                                           "',SapId='" + this.getOwnerComponent().SapId + 
                                                           "',EmployeeId='" + employeeId + "')",{ 
                success: function (data) {
                    const firma = this.getView().byId("signature");
                    if (data.MediaContent !== "") {
                        firma.setSignature("data:image/png;base64," + data.MediaContent);                        
                    }
                }.bind(this),
                error: function (e) {
//                    MessageBox.error(oResourceBundle.getText("msgSignatureNotRead"));
                }.bind(this)
            });
        };

        return Controller.extend("logaligroup.Employees.controller.OrderDetails", { 

        onInit: function() { 
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatch, this);
        },
        onBack: function(oEvent) {
            var oHistory = History.getInstance();
            var sPrevHash = oHistory.getPreviousHash();

            if (sPrevHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", true);
            }
        },
        onClearSignature: function(oEvent) {
            var firma = this.getView().byId("signature");
            firma.clear();
        },
        factoryOrderDetails: function(listId,oContext) {
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
        onSaveSignature: function(oEvent) {
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
        },
        onBeforeUpload: function (oEvent) {
            let filename = oEvent.getParameter("fileName");
            let objeto = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
            let parameterSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: objeto.OrderID + ";" + this.getOwnerComponent().SapId + ";" + objeto.EmployeeID + ";" + filename
            });
            oEvent.getParameters().addHeaderParameter(parameterSlug);
        },
        onFileChange: function (oEvent) {
            let oUploadCollection = oEvent.getSource();
            //Header Token CSRF
            let parameterToken = new sap.m.UploadCollectionParameter({
                name: "x-csrf-token",
                value: this.getView().getModel("incidenceModel").getSecurityToken()
            });
            oUploadCollection.addHeaderParameter(parameterToken);
        }           
        
        });
}); 
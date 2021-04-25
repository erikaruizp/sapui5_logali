//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.MessageToast} MessageToast
     */
	function (Controller,JSONModel,Filter,FilterOperator,MessageToast) {
        "use strict";

        function onInit() {
            var oJSONModel1 = new JSONModel();
            var oJSONModel2 = new JSONModel();
            var oView = this.getView();
            //const oResourceBundle = oView.getModel("i18n").getResourceBundle(); 
            oJSONModel1.loadData("./localService/mockdata/Employees.json",false);
            oView.setModel(oJSONModel1,"jsonEmployee");
            oJSONModel2.loadData("./localService/mockdata/Countries.json",false);
            oView.setModel(oJSONModel2,"jsonCountry");    
            
             var oJSONModelConfig = new JSONModel({
                 visibleID: true,
                 visibleName: true,
                 visibleCountry: true,
                 visibleCity: false,
                 visibleBtnShowCity: true,
                 visibleBtnHideCity: false,
                 visibleShowDetail: true,                 
             });
             oView.setModel(oJSONModelConfig,"jsonConfig");
         };
         function onLiveChange() {                
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();                 
                //var mOK = oResourceBundle.getText("textOK");
                //var mNOK = oResourceBundle.getText("textNotOK");

                var idEmp = this.byId("inputEmployee");
                var valueEmp = idEmp.getValue();

                if (valueEmp.length === 6) {
                //    idEmp.setDescription(mOK);
                    this.getView().byId("slCountry").setVisible(true);
                    this.getView().byId("labelCountry").setVisible(true);
                }else{
                //    idEmp.setDescription(mNOK);
                    this.getView().byId("slCountry").setVisible(false);
                    this.getView().byId("labelCountry").setVisible(false);                
                }
            };
        function onFilter() {
            var oJSON = this.getView().getModel("jsonCountry").getData();
            var filters = [];

            if (oJSON.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID",FilterOperator.EQ,oJSON.EmployeeId));
            }

            if (oJSON.CountryKey !== "") {
                filters.push(new Filter("Country",FilterOperator.EQ,oJSON.CountryKey));
            }

            var oTable = this.getView().byId("tableEmployee");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(filters);
        };
        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountry");
            oModel.setProperty("/EmployeeId","");
            oModel.setProperty("/CountryKey","");
        };
        function onShowPostal(oEvent) {
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployee");
            var objectContext = oContext.getObject();
            var mensaje = oResourceBundle.getText("columnPostal") + ": " + objectContext.PostalCode;
            MessageToast.show(mensaje);
        };
        function onShowCity() {
            var oModel = this.getView().getModel("jsonConfig");
            oModel.setProperty("/visibleCity", true);
            oModel.setProperty("/visibleBtnShowCity", false);
            oModel.setProperty("/visibleBtnHideCity", true);
        };
        function onHideCity() {
            var oModel = this.getView().getModel("jsonConfig");
            oModel.setProperty("/visibleCity", false);
            oModel.setProperty("/visibleBtnShowCity", true);
            oModel.setProperty("/visibleBtnHideCity", false);            
        };      
        function onShowOrders(oEvent) {
            var iconPress = oEvent.getSource();
            var oContext = iconPress.getBindingContext("jsonEmployee");

            if (!this._oDialogOrder) {
                this._oDialogOrder = new sap.ui.xmlfragment("logaligroup.Employees.fragment.DialogOrders",this);
                this.getView().addDependent(this._oDialogOrder);                
            }
            this._oDialogOrder.bindElement("jsonEmployee>" + oContext.getPath());
            this._oDialogOrder.open();
            
 /*         const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var oTable = this.getView().byId("tableOrder");
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployee");
            var objectContext = oContext.getObject();
            var orders = objectContext.Orders;
            
            oTable.destroyItems();

            var orderItems = [];
            for (var i in orders) {
                orderItems.push( new sap.m.ColumnListItem({
                            cells: [
                                    new sap.m.Label({ text: orders[i].OrderID }),
                                    new sap.m.Label({ text: orders[i].Freight }),
                                    new sap.m.Label({ text: orders[i].ShipAddress })
                                ]}));  
            }
            var newTable1 = new sap.m.Table({
                width: "auto",
                columns: [
                          new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>columnOrderID}" }) }),
                          new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>columnOrderFreight}" }) }),
                          new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>columnOrderShipAddress}" }) })
                         ],
                items: orderItems,
                headerText: "{i18n>tableOrderTitle}"
            }).addStyleClass("sapUiResponsiveMargin");

            oTable.addItem(newTable1);  
            
            var newTable2 = new sap.m.Table();
            newTable2.setWidth("auto");
            newTable2.addStyleClass("sapUiResponsiveMargin");

            var columnOrderID = new sap.m.Column();
            var labelOrderID = new sap.m.Label();
            labelOrderID.bindProperty("text","i18n>columnOrderID");
            columnOrderID.setHeader(labelOrderID);  
            newTable2.addColumn(columnOrderID);         

            var columnFreight = new sap.m.Column();
            var labelFreight = new sap.m.Label();
            labelFreight.bindProperty("text","i18n>columnOrderFreight"); 
            columnFreight.setHeader(labelFreight);  
            newTable2.addColumn(columnFreight);         

            var columnShipAddress = new sap.m.Column();
            var labelShipAddress = new sap.m.Label();
            labelShipAddress.bindProperty("text","i18n>columnOrderShipAddress");                        
            columnShipAddress.setHeader(labelShipAddress);  
            newTable2.addColumn(columnShipAddress);     
            
            var columnListItem = new sap.m.ColumnListItem();

            var cellOrderID = new sap.m.Label();
            cellOrderID.bindProperty("text","jsonEmployee>OrderID");
            columnListItem.addCell(cellOrderID);

            var cellFreight = new sap.m.Label();
            cellFreight.bindProperty("text","jsonEmployee>Freight");
            columnListItem.addCell(cellFreight);
            
            var cellShipAddress = new sap.m.Label();
            cellShipAddress.bindProperty("text","jsonEmployee>ShipAddress");
            columnListItem.addCell(cellShipAddress);            

            var oBindingInf = {
                model: "jsonEmployee",
                path: "Orders",
                template: columnListItem
            };
            newTable2.bindAggregation("items",oBindingInf);
            newTable2.bindElement("jsonEmployee>" + oContext.getPath());

            var mensaje = oResourceBundle.getText("tableOrderTitle");
            newTable2.setHeaderText(mensaje);

            oTable.addItem(newTable2); */

        };
        function onCloseDialog() {
            this._oDialogOrder.close();
        }

        var Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

		Main.prototype.onInit = onInit;
        Main.prototype.onLiveChange = onLiveChange;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.onShowPostal = onShowPostal;
        Main.prototype.onShowCity = onShowCity;            
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.onShowOrders = onShowOrders;
        Main.prototype.onCloseDialog = onCloseDialog;

		return Main;
	});

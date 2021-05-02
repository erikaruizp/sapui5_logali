sap.ui.define([],

function (){
    function dateFormat(date) {
        var TimeDay = 24 * 60 * 60 * 1000;
        if (date) {
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var txtToday = oResourceBundle.getText("textToday");
            var txtYesterday = oResourceBundle.getText("textYesterday");
            var txtTomorrow = oResourceBundle.getText("textTomorrow");

            var dateNow = new Date();
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy/MM/dd"});
            var dateNowFormat = new Date(dateFormat.format(dateNow));

            switch (true) {
                case date.getTime() === dateNowFormat.getTime():                    
                    return txtToday;            
                case date.getTime() === dateNowFormat.getTime() - TimeDay:                    
                    return txtYesterday;            
                case date.getTime() === dateNowFormat.getTime() + TimeDay:                    
                    return txtTomorrow;                                
                default:
                    return '';  
            }
        }
    }
    return {
        dateFormat: dateFormat
    };
});    
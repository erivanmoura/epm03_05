sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ], function (Controller) {
        "use strict";
        return Controller.extend("tra0305.epm0305.controller.Main", {    
            onInit: function(){
            },
            aoPressionarItem: function(oEvent){
                //resgatar a coluna clicada
                let oColumnListItem = oEvent.getSource();
                // resgata o binding da coluna clicada. O Modelo não tem nome, então o getBindingContext fica sem parâmetro
                let oItem = oColumnListItem.getBindingContext().getObject();
                // resgata o ID do parceiro
                let iPartnerId = oItem.PartnerId;
                //resgata o Roteador
                let oRouter = this.getOwnerComponent().getRouter();
                //navega p/ rota de detalhe
                oRouter.navTo("RotaDetalhe", {
                    PartnerId: iPartnerId
                });
            },
            aoAdicionar: function(oEvent){
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RotaAdicionar");
            }    
            });
        });
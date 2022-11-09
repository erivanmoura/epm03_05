sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
    ], function (Controller, JSONModel, MessageBox, MessageToast) {
        "use strict";
        return Controller.extend("tra0305.epm0305.controller.Main", {    
            onInit: function() {
                this.inicializarModelosLocais();
                //resgata o Roteador
                let oRouter = this.getOwnerComponent().getRouter();
                //resgata o Modelo
                let oModel = this.getOwnerComponent().getModel();
                //resgata a View
                let oView = this.getView();
                let oController = this;

                //acessa a rota de detalhe, anexa o event patternMatched e declara função de callback para quando o evento for chamado
                oRouter.getRoute("RotaDetalhe").attachPatternMatched(function(oEvent){
                    //acessa o nome da rota
                    let sRota = oEvent.getParameter("name");
                    if(sRota === "RotaDetalhe"){
                        oController.setarControlesEditaveis(false);
                    }
                    //acessa os argumentos do Evento
                    let oArgumentos = oEvent.getParameter("arguments");
                    //acessa o PartnerId
                    let iPartnerId = oArgumentos.PartnerId;
                    //gera o caminho do modelo
                    let sCaminho = oModel.createKey("/BusinessPartners", {
                        PartnerId: iPartnerId
                    });
                    oView.bindElement(sCaminho);
                });

                oRouter.getRoute("RotaAdicionar").attachPatternMatched(function(oEvent){
                    this.setarPropriedadeModelo("editavel", "/editavel", true);
                    //habilitar o modo de edição
                    this.setarPropriedadeModelo("botoes", "/editar", true);
                    //desabilitar o modo de visualização
                    this.setarPropriedadeModelo("botoes", "/visualizar", false);
                    var oContext = oModel.createEntry("/BusinessPartners", {
                        properties: {
                            PartnerId: "",
                            PartnerType: "",
                            PartnerName1: "",
                            PartnerName2: "",
                            SearchTerm1: "",
                            SearchTerm2: "",
                            Street: "",
                            HouseNumber: "",
                            District: "",
                            City: "",
                            Region: "",
                            ZipCode: "",
                            Country: ""
                        }
                    });
                    oView.bindElement(oContext.getPath());
                }.bind(this));
            },
            setarControlesEditaveis: function(bValor){
               
                var sPath ;
                let oModel = new JSONModel();
                //se verdadeiro
                if(bValor){
                    //carrega modelo a partir do arquivo controlesAbertos
                    oModel.loadData('./model/controlesAbertos.json');
                }
                //se falso
                else{
                    //carrega modelo a partir do arquivo controlesFechados
                    oModel.loadData('./model/controlesFechados.json');
                   
                }
                this.getView().setModel(oModel, "editavel");
            },
            aoEditar: function(oEvent){
                //habilitar o modo de edição
                this.setarPropriedadeModelo("editavel","/editavel",true);
                //habilitar o modo de edição
                this.setarPropriedadeModelo("botoes","/editar",true);
                //desabilitar o modo de visualização
                this.setarPropriedadeModelo("botoes","/visualizar",false);
                //grava o caminho do contexto do parceiro
                this.sCaminhoContexto = this.getView().getBindingContext().getPath()
            },
            aoCancelar: function(oEvent){
                var that = this;
                MessageBox.show("Deseja cancelar a edição?", {
                    title: "Cancelamento de edição",
                    actions: [ MessageBox.Action.YES, MessageBox.Action.NO ],
                    onClose: function(oAction){
                        if(oAction === MessageBox.Action.YES){
                            // //altera o valor da propriedade "editavel"
                            // oModel.setProperty("/editavel", false);
                            this.setarPropriedadeModelo("editavel", "/editavel", false);
                            //habilitar o modo de edição
                            this.setarPropriedadeModelo("botoes", "/editar", false);
                            //desabilitar o modo de visualização
                            this.setarPropriedadeModelo("botoes", "/visualizar", true);
                            // //resgatar o modelo
                            let oModel = this.getView().getModel();
                            // cria array com um elemento dentro - o caminho do contexto
                            let aCaminhos = [
                                this.sCaminhoContexto
                            ];                
                            //reseta alterações
                            oModel.resetChanges(aCaminhos);
                        }
                    }.bind(this) //salva o contexto do this apontando para o controller, o que ocorre fora da função
                });
            },
            aoSalvar: function(oEvent){
                //resgata o form
                var oForm = this.getView().byId("FormParceiro");
                oForm.setBusy(true);
                var oRouter = this.getOwnerComponent().getRouter();
                var oModel = this.getView().getModel();
                var oDados = this.getView().getBindingContext().getObject();

                if(oDados.PartnerId){
                    oModel.update(this.sCaminhoContexto, oDados, {
                        success: function (oData){
                            MessageToast.show("Atualização do parceiro " + oDados.PartnerId + " feita com sucesso!");
                            oForm.setBusy(false);
                            // //altera o valor da propriedade "editavel"
                            // oModel.setProperty("/editavel", false);
                            this.setarPropriedadeModelo("editavel", "/editavel", false);
                            //habilitar o modo de edição
                            this.setarPropriedadeModelo("botoes", "/editar", false);
                            //desabilitar o modo de visualização
                            this.setarPropriedadeModelo("botoes", "/visualizar", true);
                        }.bind(this),
                        error: function (oError){
                            MessageBox.error("Erro ao atualizar parceiro " + oDados.PartnerId);
                            oForm.setBusy(false);
                        }.bind(this)
                     });
                }else{
                    oModel.create("/BusinessPartners", oDados, {
                        success: function (oData){
                            MessageToast.show("Parceiro " + oDados.PartnerId + " criado com sucesso!");
                            oForm.setBusy(false);
                            oRouter.navTo("RouterMaster", true);
                        }.bind(this),
                        error: function (oError){
                            var oErro = JSON.parse(oError.responseText);
                            MessageBox.error("Erro ao salvar:\n\n" + oErro.error.message.value);
                            oForm.setBusy(false);
                        }.bind(this)
                     });
                }

            },
            inicializarModelosLocais: function(){
                //cria nova instância de um modelo JSON
                var oModeloBotao = new JSONModel();
                //cria propriedade visualizar que controla o modo de visualização
                oModeloBotao.setProperty("/visualizar", true);
                //cria propriedade editar que controla o modo de edição
                oModeloBotao.setProperty("/editar", false);
                var oView = this.getView();
                oView.setModel(oModeloBotao, "botoes");
            },
            setarPropriedadeModelo: function(sModelo, sPropriedade, bValor) {
                var oModel = this.getView().getModel(sModelo);
                //validar que a instãncia não esta undefined
                if (oModel){
                    oModel.setProperty(sPropriedade, bValor);  
                }
            },
            aoDigitarCEP: function(oEvent){
                //acessa o valor do Input
                let sValor = oEvent.getParameter("value");
                //resgata o Input
                var oInput = oEvent.getSource();
                if(sValor.length !== 9){
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                }else{
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
            },
        });
    });
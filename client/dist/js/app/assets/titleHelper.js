define(["handlebars","utils","text!templates/partials/title.hbs","assets/ifCondHelper","assets/localizationHelper"],function(e,t,l){return t.getFromCache("titleTpl")||t.setToCache("titleTpl",e.compile(l))});
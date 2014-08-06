// ==UserScript==
// @name        TracClientConfig
// @namespace   tracclientconfig
// @include     */trac/*
// @version     1
// @grant       none
// ==/UserScript==

console.log('Runnning track hacks!');
(function(document,$){
    
    var _cfg = {
              'query':{
                  'post':function(path,cfg,doc,$){
                        var el = doc.getElementById('filters');
                        if(el)el.setAttribute('class','');
                    },
              },
             'roadmap':{
                 'queryParams':'',
                 'post':function(path,cfg,doc,$){
                        if(cfg.queryParams)
                        $('span.first.interval > a').map(function(idx,item,arr){
                            console.log(item.href);
                            console.log(cfg.queryParams);
                            item.href += cfg.queryParams;
                            return item;
                         });
                  }        
              }
          };
    
    
    function readpanels($,cfg){
        var ret = {};
        var panels = $('div.nav#mainnav > ul > li > a').map(function(idx,item,arr){
            return item.href ? item.href.match('\\w+$'): '';
        });

        for(var idx in panels)
            ret[panels[idx]] = cfg[panels[idx]];
        return ret ;
    }
    
    function makecfgpanel(doc,$,cfg){
        
    }
    
    function merge(from,to){
        to = to && merge(to) || {};
        if(from){
          for(var p in from){
            if(!(p in to)){
              to[p] = from[p];
            }else if(typeof from[p] === 'object') {
              to[p] = merge(from[p],to[p]);
            }
          }
          return to;
        }
        return to || from || {};
    }


    
    function readcfg(nm,db,ctx){
        var cfg = merge(merge(_cfg,db.val(nm)),ctx && ctx[nm]);
        console.log(cfg);
        return cfg;
    }
    
    function ready(path,procs,document,$){
        var pttrn = path.match('\\w+$');
        pttrn = pttrn && pttrn.length && pttrn[0];
        if(pttrn && procs[pttrn].post){
            console.log('Triggered '+pttrn + ' for ' +path);
            return procs[pttrn].post(path,procs[pttrn],document,$);
        }
    };
    
    Storage.prototype._fs = {};
    Storage.prototype.val = function(k,v){
        if(typeof v === 'function'){
            this._fs[k] = v;
            return v;
        }
        if(v === undefined){
            try{
                return JSON.parse(this.getItem(k)) || this._fs[k];
            }catch(e){
                return this.getItem(k) || this._fs[k];
            }
        }else{
            try{
               var jv = JSON.stringify(v);
               this.setItem(k,jv);
               return jv;
            }catch(e){
                this.setItem(k,v);
                return v;
            }
        };
    }
    document.onreadystatechange = function(state){
         if(document.readyState === 'complete'){
           var cfg = readcfg('tracclientcfg',sessionStorage,this);
           ready(location.pathname,cfg,document,jQuery);
         }
    }


    
})(document,jQuery);

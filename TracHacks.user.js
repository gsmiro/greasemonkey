// ==UserScript==
// @name        TracClientConfig
// @namespace   tracclientconfig
// @include     */trac/*
// @version     1
// @grant       none
// ==/UserScript==

console.log('Runnning track hacks!');
document.onreadystatechange = function(){
    console.log(document.readyState)
}
(function(document,$){
    console.log('ini')
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
                     $('span.first.interval > a').map(function(idx,item,arr){
                         item.href = cfg.queryParams || item.href;
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
    
    function readcfg(nm,ctx){
        console.log('readcfg ' );
        return ctx && ctx[nm] || _cfg;
    }
    
    function ready(path,procs,document,$){
        console.log('ready');
        var pttrn = path.match('\\w+$');
        console.log(pttrn);
        pttrn = pttrn && pttrn.length && pttrn[0];
        console.log(procs[pttrn].post)
        if(pttrn && procs[pttrn].post){
            console.log('Triggered '+pttrn + ' for ' +path);
            return procs[pttrn].post(path,procs[pttrn],document,$);
        }
    };
    
    console.log(Storage)
    
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
           var cfg = readcfg('tracclientcfg',this);
           ready(location.pathname,cfg,document,jQuery);
         }
    }


    
})(document,jQuery);
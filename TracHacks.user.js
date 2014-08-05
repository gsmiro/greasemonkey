// ==UserScript==
// @name        TracClientConfig
// @namespace   tracclientconfig
// @include     */trac/*
// @version     1
// @grant       none
// ==/UserScript==

console.log('Runnning track hacks!');
(function(document,$){
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
    
    function readcfg(db,ctx){
        var nm = 'tracclientcfg';
        return ctx && ctx[nm] && db.val(nm,ctx[nm]) || db.val(nm) || db.val(nm,
          {
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
          });
    }
    
    function ready(path,procs,document,$){
        var pttrn = path.match('\\w+$');
        pttrn = pttrn && pttrn.length && pttrn[0];
        if(pttrn && procs[pttrn].post){
            console.log('Triggered '+pttrn + ' for ' +path);
            return procs[pttrn].post(path,procs[pttrn],document,$);
        }
    };
    
    Storage.prototype.val = function(k,v){
        if(v === undefined){
            try{
                return JSON.parse(this.getItem(k))
            }catch(e){
                return this.getItem(k);
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
           var cfg = readcfg(localStorage,this);
           ready(location.pathname,cfg,document,jQuery);
         }
    }


    
})(document,jQuery);

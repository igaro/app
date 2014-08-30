module.exports = function(app) {

    return function(o) {
    
        this.map = new Object().constructor({ handle:null, marker:null });
    
        this.coords = new Object().constructor({
            lat:null,
            lng:null,
            callback : function(o) {},
            update : function(o) {
                this.latitude=o.latitude;
                this.longitude=o.longitude;
                this.callback(o);
            }
        });
    
        this.zip = new Object().constructor({ loaded:false });
    
        this.init = function(o) {
            
            var c = $(o.container);
            if (o.callback) this.coords.callback = o.callback;
            var e2=document.createElement('ul');
            e2.className='navmenu';
            c.appendChild(e2);
            
            if (!! navigator.geolocation) {
                var e3=document.createElement('li');
                e3.className='inactive';
                e3.id = 'tab_'+o.container+'_geolocation';
                var a1 = document.createElement('a');
                a1.href='';
                a1.onclick = function() { return igaro.tabs.toggle(o.container+'_geolocation'); }
                a1.innerHTML = 'Geolocation';
                e3.appendChild(a1);
            e2.appendChild(e3);
            }
            
            var e4=document.createElement('li');
            e4.className='inactive';
            e4.id = 'tab_'+o.container+'_zip';
            var a2 = document.createElement('a');
            a2.href='';
            a2.onclick = function() {
                if (! self.zip.loaded) {
                    var aj = new ajax();
            aj.requestFile = igaro.url.current({ nosearch:true })+'?i=locationfromzip&countries';
            aj.onCompletion = function(o) {
                        e9.innerHTML='';
                        var l2 = document.createElement('label');
                        l2.innerHTML='Country';
                        e9.appendChild(l2);
                        var s1 = document.createElement('select');
                        s1.size=1;
                        e9.appendChild(s1);
                        l2.htmlFor = s1;
                        l2.setAttribute('for',s1);
                        var o1 = document.createElement('option');
                        o1.value='';
                        o1.text='[Select]';
                        s1.appendChild(o1);
                        for (var i=0; i<o.countries.length; i++) {
                            var op = document.createElement('option');
                            op.value=o.countries[i].id;
                            op.text=o.countries[i].title;
                            s1.appendChild(op);
                        }
                        var b1 = document.createElement('br');
                        e9.appendChild(b1);
                        var b2 = document.createElement('br');
                        e9.appendChild(b2);
                        var l3 = document.createElement('label');
                        l3.innerHTML='Zip/Postcode';
                        e9.appendChild(l3);
                        var it1 = document.createElement('input');
                        it1.type='text';
                        it1.size=8;
                        it1.maxlength=8;
                        e9.appendChild(it1);
                        var b3 = document.createElement('br');
                        e9.appendChild(b3);
                        var b4 = document.createElement('br');
                        e9.appendChild(b4);
                        var l3y = document.createElement('label');
                        l3y.innerHTML='';
                        e9.appendChild(l3y);
                        var ith = document.createElement('input');
                        ith.type='submit';
                        ith.className='frmobjspace';
                        ith.innerHTML = 'Find';
                        ith.onclick = function() {
                            var aj = new ajax();
                            aj.onCompletion = function(o) {
                                if (o.error == 'invalid') {
                                    igaro.error.on(it1, 'Sorry, we don\'t have details for this location.');
                                    ith.disabled = true;
                                    return;
                                }
                                it1.value='';
                                s1.selectedIndex = 0;
                                self.coords.update({ latitude:o.latitude, longitude:o.longitude });
                                s1.onchange();
                            }
                            aj.requestFile = igaro.url.current({ nosearch:true })+'?i=locationfromzip&country='+s1.options[s1.selectedIndex].value+'&zip='+it1.value;
                            aj.run();
                            return false;
                        }
                        e9.appendChild(ith);
                        it1.oninput = s1.onchange = function() {
                            it1.disabled = (s1.selectedIndex == 0)? true:false;
                            ith.disabled = (it1.value.length == 0 || it1.disabled)? true:false;
                            igaro.error.clear();
                        };
                        s1.onchange();
                        self.zip.loaded=true;
            }
            aj.run();
                }
                return igaro.tabs.toggle(o.container+'_zip');
            }
            a2.innerHTML = 'Zip/Postcode';
            e4.appendChild(a2);
            e2.appendChild(e4);
    
            var e5=document.createElement('li');
            e5.className='inactive';
            e5.id = 'tab_'+o.container+'_map';
            var a3 = document.createElement('a');
            a3.href=' ';
            var self=this;
            a3.onclick = function() {
                igaro.tabs.toggle(o.container+'_map');
                if (self.map.handle) return false;
                igaro.file.load({ src:'http://maps.googleapis.com/maps/api/js?key=AIzaSyDNXQ5go80HlxX8MydQy2_f9AEIS3ipuJg&sensor=false&callback=gmapload' });
                window.gmapload = function() {
                    self.map.handle = new google.maps.Map(erh, { zoom: 2,center: new google.maps.LatLng(70, 200),mapTypeid: google.maps.MapTypeid.ROADMAP });
                    google.maps.event.addListener(self.map.handle, 'click', function(event) {
                        if (self.map.marker) self.map.marker.setMap(null);
                        self.map.marker = new google.maps.Marker({ position:event.latLng, map:self.map.handle });
                        self.coords.update({ latitude:event.latLng.lat(), longitude:event.latLng.lng() });
                    });
                };
                return false;
            }
            a3.innerHTML = 'Map';
            e5.appendChild(a3);
            e2.appendChild(e5);
            
            /* geolocation tab */
            if (!!navigator.geolocation) {
                var e8 = document.createElement('div');
                e8.className='sp_a';
                e8.id = 'tabcont_'+o.container+'_geolocation';
                var l1 = document.createElement('label');
                e8.appendChild(l1);
                var b1 = document.createElement('button');
                b1.innerHTML = 'Detect';
                var self=this;
                b1.onclick = function() { navigator.geolocation.getCurrentPosition(function(o) {
                    self.coords.update({ latitude:o.coords.latitude, longitude:o.coords.longitude });
                });
                
                };
                e8.appendChild(b1);
                c.appendChild(e8);
            }
            
            /* zip based location tab */
            var e9 = document.createElement('div');
            e9.id = 'tabcont_'+o.container+'_zip';
            e9.className='sp_a';
            c.appendChild(e9);
                
            /* map based location tab */
            var ert = document.createElement('div');
            ert.id = 'tabcont_'+o.container+'_map';
            var erh = document.createElement('div');
            erh.style.height='300px';
            var gl = new Image();
            gl.src = 'o/main/ajax/loading.gif';
            erh.appendChild(gl);
            ert.appendChild(erh);
            c.appendChild(ert);
        
            var e99 = document.createElement('div');
            e99.id = 'tabcont_'+o.container+'_welcome';
            e99.className='navmenu_welcome';
            c.appendChild(e99);
            
            igaro.tabs.reset(o.container);
        }
    }

};

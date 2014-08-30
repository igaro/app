module.requires = [{ name:'core.connection.xhr.upload.css' }];

module.exports = function(app) {

    app['core.connection.xhr.upload'] = function(o) {
	
        this.uploading=0,
        this.multiple=false,
        this.url=null,
        this.onComplete= function(i) {};
        this.xhr=null;
    
            this.init = function(o) {
            this.div=o.div;
            this.ctl=null;
            this.multiple=false;
            this.xhr = new XMLHttpRequest();
            if (! (this.xhr && ('upload' in this.xhr) && ('onprogress' in this.xhr.upload))) {
                    var s = document.createElement('div');
                s.innerHTML='Your browser does not support HTML5 / XHRv2 file uploading. Please update!';
                $(this.div).appendChild(s);
                return;
            }
            if (o.onstate) this.onstate = o.onstate;
            if (o.multiple) this.multiple = o.multiple;
            //if (o.multiple_max) this.multiple_max = o.multiple_max;
            //if (o.file_types) this.file_types = o.file_types;
            //if (o.file_size_max) this.file_size_max = o.file_size_max;
            if (o.onComplete) this.onComplete = function(p) { o.onComplete(p); }
            this.url = o.url;
            var self=this;
            this.ctl = document.createElement('input');
            this.ctl.type='file';
            this.ctl.multiple=o.multiple;
            this.ctl.onchange = function() {
                igaro.error.clear();
                if (self.ctl.files.length == 0) {
                    self.details.style.display='none';
                    self.submit.disabled = true;
                    return;
                } else {
                    self.details.style.display='';
                    self.submit.disabled = false;
                }
                var h = '<table cellspacing=0 cellpadding=0 class="shade">';
                h += '<thead><tr><td>File</td><td>Size</td><td>status</td><td>Done</td></tr></thead><tbody>';
                for(var i=0; i<self.ctl.files.length;i++) {
                    h += '<tr id="file_'+i+'"><td>';
                    h += self.ctl.files[i].name;
                    h += '</td><td>';
                    h += igaro.file.size.format(self.ctl.files[i].size);
                    h += '</td><td id="'+self.div+'_fileu_'+i+'">0%</td><td id="'+self.div+'_done_'+i+'" class="uploader_done_cross"></td></tr>';
                }
                h += '</tbody></tr></table>';
                self.details.innerHTML = h;
            }
            $(this.div).appendChild(this.ctl);
            this.submit = document.createElement('input');
            this.submit.type='button';
            this.submit.disabled = true;
            this.submit.value='Upload';
            this.submit.onclick = function(o) { self.send(0); };
            $(this.div).appendChild(this.submit);
            this.cancel = document.createElement('input');
            this.cancel.type='button';
            this.cancel.disabled = true;
            this.cancel.value='Cancel';
            this.cancel.className = 'frmobjspace';
            this.cancel.onclick = function(o) { 
                if (! igaro.confirm('Are you sure you want to abort?')) return;
                self.xhr.abort();
            };
            $(this.div).appendChild(this.cancel);
            this.details = document.createElement('div');
            $(this.div).appendChild(this.details);
            };
        
        this.send = function(i) {
            igaro.error.clear();
            this.uploading=i;
            var self=this;
            var xhr = this.xhr;
            xhr.upload.addEventListener('progress', onprogressHandler, false);
            xhr.open('POST',this.url, true);
            //xhr.upload.onerror = function(e) { alert(e); };
            xhr.upload.onabort = function() {
                self.details.style.display='none';
                self.ctl.value='';
                self.uploading=0;
                self.send.disabled=self.cancel.disabled=true;
                self.ctl.disabled=false;
            };
            xhr.setRequestHeader("X-File-Name", this.ctl.files[i].name);
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            this.submit.disabled = this.ctl.disabled=true;
            this.cancel.disabled = false;
            xhr.onreadystatechange = function() {
                switch (xhr.readyState) {
                case 4:
                    if (xhr.status == '200') {
                        var o={};
                        try {
                            if (xhr.responseText.length) o=JSON.parse(xhr.responseText);
                            
                            if (o.main_error) {
                                xhr.abort();
                                igaro.error.out(o.main_error); // handle main error }
                                return;
                            } else if (o.error) {
                                $(self.div+'_fileu_'+self.uploading).innerHTML = o.error;
                                $(self.div+'_done_'+self.uploading).className='uploader_done_cross';
                            } else {
                                self.onComplete({ name:self.ctl.files[self.uploading].name });
                                $(self.div+'_done_'+self.uploading).className='uploader_done_tick';
                                $(self.div+'_fileu_'+self.uploading).innerHTML = '100%';
                            }
                            //send next file in queue
                            if (i < self.ctl.files.length-1) {
                                self.send(i+1);
                                self.cancel.disabled=false;
                            } else {
                                self.uploading=0;
                                self.ctl.value='';
                                self.ctl.disabled = false;
                                self.send.disabled=self.cancel.disabled=true;
                            }
                        } catch (e) {
                            igaro.error.out(e+''); xhr.abort();
                        }
                    } else {
                        var e='';
                        if (xhr.status == '0') e = 'The connection to the server failed.';
                        else e='The resource failed to load ('+xhr.status+').';
                        if (xhr.statusText.length) e += '\n.status: '+xhr.statusText;
                        if (xhr.responseText.length) e += '\n.Response: '+xhr.responseText;
                        igaro.error.on(self.ctl, e);
                        xhr.abort();
                    }
                }
            }
            xhr.send(this.ctl.files[i]);
            function onprogressHandler(evt) { 
                var s = self.ctl.files[self.uploading].size;
                $(self.div+'_fileu_'+self.uploading).innerHTML = ((evt.loaded/s)*100).toFixed(2)+'%';
                if (s == evt.loaded) {
                    $(self.div+'_done_'+self.uploading).className='uploader_done_waiting';
                    self.cancel.disabled=true;
                }
            }
        };
    
    }

    return true;

};
/**
 * Kastor fancybox/lightbox viewer
 * @author: alexandre Oger <oger.alexandre@gmail.com>
 */

;(function() {
    'use strict';

    var Kastor = function(imgSelector, gallerySelector) {

        // add the lightbox to body
        this.$$addViewer();

        // set the listeners
        this.$$addListeners();

        // init somes properties use in methods
        this.uid = 1;
        this.current = 1;
        this.imgSelector = imgSelector || '[ks-img]'; 
        this.gallerySelector = gallerySelector || '[ks-gallery]';
        this.viewer = document.querySelector('[ks-viewer]');
        this.imgNode = this.viewer.querySelector('img');
        this.videoNode = this.viewer.querySelector('video');
        this.iframeNode = this.viewer.querySelector('iframe');
        this.htmlNode = this.viewer.querySelector('.ks-container div');

        // get all media items
        var nodes = this.$$getNodes();

        //remove or not pager
        this.$$checkNumber(nodes);
        
        // assign an UID for each item
        this.$$setUid(nodes);
    };

    Kastor.prototype.$$addViewer = function() {

        var viewerNode = document.createElement('article');

        viewerNode.setAttribute('ks-viewer', '');
        viewerNode.innerHTML = ['<div class="ks-container">',
                                '<img src="" alt="">',
                                '<video src="" autoplay></video>',
                                '<iframe width="640" height="390" src="" frameborder="0" allowfullscreen></iframe>',
                                '<div></div>',
                                '</div>',
                                '<a href="" ks-close title=""></a>',
                                '<a href="" ks-prev title=""></a>',
                                '<a href="" ks-next title=""></a>',
                                '<div class="spinner">',
                                '<div class="bounce1"></div>',
                                '<div class="bounce2"></div>',
                                '<div class="bounce3"></div>',
                                '<div class="bounce4"></div>',
                                '</div>'].join('');
        document.body.appendChild(viewerNode);
    };

    Kastor.prototype.$$addListeners = function() {

        var self = this;
        document.querySelector('[ks-next]')
            .addEventListener('click', this.$$next.bind(this), false);

        document.querySelector('[ks-prev]')
            .addEventListener('click', this.$$prev.bind(this), false);

        document.querySelector('.ks-container')
            .addEventListener('click', this.$$unloadMedia.bind(this), false);

        document.onkeydown = function(event) {

            event = event || window.event;

            switch(event.which || event.keyCode) {
                // esc
                case 27:
                self.$$unloadMedia();
                break;

                // right
                case 39:
                self.$$next();
                break;

                // left
                case 37:
                self.$$prev();
                break;

                default:
                return;
            }
        };
    };

    Kastor.prototype.$$getNodes = function() {

        var gallery = document.querySelector(this.gallerySelector) || document;
        var nodes = gallery.querySelectorAll(this.imgSelector+', [ks-video], [ks-iframe], [ks-html]');
    
        if(!nodes.length) {
            throw 'Kastor.js - can\'t find any image or media to load, did you set the correct ks-xxx attributes ?';
        }

        return nodes;
    };

    Kastor.prototype.$$checkNumber = function(nodes) {

        if(nodes.length<=1){
            this.viewer.querySelector('[ks-prev]').style.display = "none";
            this.viewer.querySelector('[ks-next]').style.display = "none";
        }
    };

    Kastor.prototype.$$setUid = function(nodes) {
        
        var self = this;
        _.forEach(nodes, function(node) {
            node.setAttribute('ks-uid', self.uid++);
            node.addEventListener('click', function(event) {
                event.preventDefault();
                self.$$loadMedia(node);
            }, false);
        });
    };

    Kastor.prototype.$$loadMedia = function(node) {
        
        var img = node.getAttribute('ks-img');
        var video = node.getAttribute('ks-video');
        var iframe = node.getAttribute('ks-iframe');
        var html = node.getAttribute('ks-html');
        var uid = node.getAttribute('ks-uid');

        this.$$unloadMedia();

        this.viewer.setAttribute('ks-status', 'opened');
        var spinner = this.viewer.querySelector('.spinner');
        spinner.setAttribute('class', 'spinner loading');

        if(img !== null) {

            this.imgNode.setAttribute('class', '');
            this.imgNode.setAttribute('src', img);

            this.imgNode.addEventListener('load', function() {
                spinner.setAttribute('class', 'spinner ');
                this.setAttribute('class', 'show');
            });
        } else if(video !== null) {

            this.videoNode.setAttribute('src', video);

            this.videoNode.onloadeddata = function() {
                spinner.setAttribute('class', 'spinner ');
                this.setAttribute('class', 'show');
            };
        } else if(iframe !== null) {

            this.iframeNode.setAttribute('src', iframe);
            this.iframeNode.onload = function() {
                spinner.setAttribute('class', 'spinner ');
                this.setAttribute('class', 'show');
                this.onload = null;
            };
        } else if(html !== null) {

            var self = this;
            var req = new XMLHttpRequest();
            req.open('GET', html, true);
            req.onreadystatechange = function () {
                if (req.readyState !== 4 || req.status !== 200) {
                    return;
                }
                self.htmlNode.innerHTML += req.responseText;
                spinner.setAttribute('class', 'spinner ');
                self.htmlNode.setAttribute('class', 'show');
            };
            req.send();
        }
        
        this.current = uid;
    };

    Kastor.prototype.$$unloadMedia = function(event) {

        if (event && event.preventDefault) {
            event.preventDefault();
        } else if(event) {
            event.returnValue = false;
        }

        this.imgNode.setAttribute('src','');
        this.videoNode.setAttribute('src','');
        this.iframeNode.setAttribute('src','');
        this.htmlNode.innerHTML = '';
        this.viewer.setAttribute('ks-status', 'closed');
        this.imgNode.setAttribute('class', '');
        this.videoNode.setAttribute('class', '');
        this.iframeNode.setAttribute('class', '');
        this.htmlNode.setAttribute('class', '');
    };

    Kastor.prototype.$$next = function(event) {

        var node;

        if (event && event.preventDefault) {
            event.preventDefault();
        } else if(event) {
            event.returnValue = false;
        }

        if(this.current < this.uid-1) {
            node = document.querySelector('[ks-uid="'+(++this.current)+'"]');
        } else {
            node = document.querySelector('[ks-uid="1"]');
        }
        this.$$loadMedia(node);
    };

    Kastor.prototype.$$prev = function(event) {

        var node;

        if (event && event.preventDefault) {
            event.preventDefault();
        } else if(event) {
            event.returnValue = false;
        }

        if(this.current > 1) {
            node = document.querySelector('[ks-uid="'+(--this.current)+'"]');
        } else {
            node = document.querySelector('[ks-uid="'+(this.uid-1)+'"]');
        }
        this.$$loadMedia(node);
    };

    /** 
     * export to window object for browser 
     * or module.export for nodejs (need for test)
     **/
    if (typeof exports !== 'undefined') { 
        module.exports = Kastor;
    } else {
        window.Kastor = Kastor;
    }
})();
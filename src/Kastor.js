/**
 * Kastor fancybox/lightbox viewer
 * @author: alexandre Oger <oger.alexandre@gmail.com>
 */

;(function() {
    'use strict';

    var Kastor = function(imgSelector, gallerySelector) {

        // add the lightbox to body
        this.$$addViewer();

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
        // assign an UID for each item
        this.$$setUid(nodes);
    };

    Kastor.prototype.$$addViewer = function() {

        var viewerNode = document.createElement('article');
        viewerNode.setAttribute('ks-viewer', '');
        viewerNode.innerHTML = '<div class="ks-container">'
            + '<img src="" alt="">'
            + '<video src="" autoplay></video>'
            + '<iframe width="640" height="390" src="" frameborder="0" allowfullscreen></iframe>'
            + '<div></div>'
            + '</div>'
            + '<a href="" ks-prev title="">‹</a>'
            + '<a href="" ks-next title="">›</a>';
        document.body.appendChild(viewerNode);

        document.querySelector('[ks-next]')
            .addEventListener('click', this.$$next.bind(this), false);

        document.querySelector('[ks-prev]')
            .addEventListener('click', this.$$prev.bind(this), false);

        document.querySelector('.ks-container')
            .addEventListener('click', this.$$unloadMedia.bind(this), false);
    }

    Kastor.prototype.$$getNodes = function() {

        var gallery = document.querySelector(this.gallerySelector) || document;
        var nodes = gallery.querySelectorAll(this.imgSelector+', [ks-video], [ks-iframe], [ks-html]');
    
        if(!nodes.length) {
            throw 'Kastor.js - can\'t find any image or media to load, did you set the correct ks-xxx attributes ?';
        }

        return nodes;
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

        if(img !== null) {

            this.imgNode.setAttribute('class', '');
            var loadIt = function loadIt() {
                this.imgNode.setAttribute('src', img);
                this.imgNode.addEventListener('load', function(e) {
                    this.setAttribute('class', 'show');
                });
            }
            setTimeout(loadIt.bind(this), 1000);
            
        } else if(video !== null) {
            this.videoNode.setAttribute('src', video);
            this.videoNode.setAttribute('class', 'show');
        } else if(iframe !== null) {
            this.iframeNode.setAttribute('src', iframe);
            this.iframeNode.setAttribute('class', 'show');
        } else if(html !== null) {
            var self = this;
            var req = new XMLHttpRequest();
            req.open('GET', html, true);
            req.onreadystatechange = function () {
                if (req.readyState !== 4 || req.status !== 200) {
                    return;
                }
                self.htmlNode.innerHTML += req.responseText;
                self.htmlNode.setAttribute('class', 'show');
            };
            req.send();
        }
        
        this.current = uid;
    };

    Kastor.prototype.$$unloadMedia = function() {

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

        event ? event.preventDefault() : '';
        if(this.current < this.uid-1) {
            var node = document.querySelector('[ks-uid="'+(++this.current)+'"]');
            this.$$loadMedia(node);
        }
    };

    Kastor.prototype.$$prev = function(event) {

        event ? event.preventDefault() : '';
        if(this.current > 1) {
            var node = document.querySelector('[ks-uid="'+(--this.current)+'"]');
            this.$$loadMedia(node);
        }
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
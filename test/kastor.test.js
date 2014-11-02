var expect = chai.expect;
 
describe("Kastor", function() {
    var ks = new Kastor();

    describe("constructor", function() {

        it("should exists and not throws errors", function() {
            expect(ks).to.exist;
        });
    });

    describe("addViewer", function() {

        it("should add a viewer node to body", function() {
            expect(document.querySelector('[ks-viewer]')).to.not.be.null;
        });
    });

    describe("setUid", function() {

        it("should add an uid for each node item", function() {
            var nodes = document.querySelectorAll('[ks-img], [ks-video], [ks-iframe], [ks-html]');
            var flag = false;
            for(var i = 0; i < nodes.length; i++) {
                if(nodes[i].getAttribute('ks-uid') === null) flag = true;
            }
            expect(flag).to.equal(false);
        });
    });

    describe('loadMedia', function () {
        it('should load the correct uid', function () {
            var node = document.querySelector('[ks-uid="1"]');
            ks.$$loadMedia(node);
            var imgSrc = document.querySelector('[ks-viewer] img').getAttribute('src');
            expect(imgSrc).to.have.length.above(0);
            var iframeSrc = document.querySelector('[ks-viewer] iframe').getAttribute('src');
            expect(iframeSrc).to.not.have.length.above(0);
        });
    });

    describe('unLoadMedia', function () {
        it('should unload all media source from viewer', function () {
            ks.$$unloadMedia();
            var viewer = document.querySelector('[ks-viewer]');
            var imgSrc = viewer.querySelector('img').getAttribute('src');
            var iframeSrc = viewer.querySelector('iframe').getAttribute('src');
            var videoSrc = viewer.querySelector('video').getAttribute('src');
            var htmlSrc = viewer.querySelector('div').innerHtml;

            expect(imgSrc).to.have.length(0);
            expect(iframeSrc).to.have.length(0);
            expect(videoSrc).to.have.length(0);
            console.log(htmlSrc);
            expect(htmlSrc).to.be.undefined;
        });
    });

    describe('next/prev', function () {
        it('should load the next media item', function () {
            var nodeSrc = document.querySelector('[ks-uid="2"]').getAttribute('ks-img');
            ks.$$loadMedia(document.querySelector('[ks-uid="1"]'));
            ks.$$next();
            var viewerSrc = document.querySelector('[ks-viewer] img').getAttribute('src');
            
            expect(nodeSrc === viewerSrc).to.be.true;
        });

        it('should load the prev media item', function () {
            var nodeSrc = document.querySelector('[ks-uid="1"]').getAttribute('ks-img');
            ks.$$loadMedia(document.querySelector('[ks-uid="2"]'));
            ks.$$prev();
            var viewerSrc = document.querySelector('[ks-viewer] img').getAttribute('src');
            
            expect(nodeSrc === viewerSrc).to.be.true;
        });

        it('should not load the prev media item when it\'s the first item', function () {
            var nodeSrc = document.querySelector('[ks-uid="1"]').getAttribute('ks-img');
            ks.$$loadMedia(document.querySelector('[ks-uid="1"]'));
            ks.$$prev();
            var viewerSrc = document.querySelector('[ks-viewer] img').getAttribute('src');
            
            expect(nodeSrc === viewerSrc).to.be.true;
        });

        it('should not load the next media item when it\'s the last item', function () {
            var nodeSrc = document.querySelector('[ks-uid="'+(ks.uid-1)+'"]').getAttribute('ks-img');
            ks.$$loadMedia(document.querySelector('[ks-uid="'+(ks.uid-1)+'"]'));
            ks.$$next();
            var viewerSrc = document.querySelector('[ks-viewer] img').getAttribute('src');

            expect(nodeSrc === viewerSrc).to.be.true;
        });
    });
});
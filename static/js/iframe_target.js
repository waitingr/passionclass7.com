(function () {
    // 将所有a标签的target属性设置成_self
    function aTagsChange() {
        var aTags = document.getElementsByTagName('a');
        for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].getAttribute('target') !== '_self') {
                aTags[i].setAttribute("target", "_self");
            }
        }
    }
    
    if (self.name === 'iframe_target') {
        aTagsChange();

        // banner图片区域的元素是动态获取的，1秒后再次执行改变后续a标签
        setTimeout(function () {
            aTagsChange();
        },1000);

        setTimeout(function () {
            aTagsChange();
        },2000);

        setTimeout(function () {
            aTagsChange();
        },3000);

        setTimeout(function () {
            aTagsChange();
        },5000);
    }
})()
/*  |xGv00|98f572220c08f576f51773349929cadd */
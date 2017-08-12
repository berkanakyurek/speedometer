(function() {

    var Timer = {

        init: function () {
            setTimeout(Timer.SpeedMeasure, 0);
        },

        SpeedMeasure: function () {

            var t = performance.timing;
            var start = t.redirectStart === 0 ? t.fetchStart : t.redirectStart;

            if (t.loadEventEnd > 0)
            {
                var time = String(((t.loadEventEnd - start) / 1000).toPrecision(3)).substring(0, 4);
                var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

                var timing = {};

                for (var p in t)
                {
                    if (typeof(t[p]) !== "function")
                        timing[p] = t[p];
                }

                chrome[roe].sendMessage({time: time, timing: timing});
            }

        }
    };

    if (document.readyState === "complete")
        Timer.init();
    else
        window.addEventListener("load", Timer.init);

})();
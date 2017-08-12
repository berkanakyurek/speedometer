var Background = {

    Type: null,

    init: function () {
        Background.Type = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

        chrome[Background.Type].onMessage.addListener(Background.SetToolbarBagdeText);
        chrome.tabs.onRemoved.addListener(Background.OnTabClosed);
    },

    SetToolbarBagdeText: function (request, sender, sendResponse) {

        chrome.storage.local.get('cache', function(data) {

            if (!data.cache)
                data.cache = {};
            data.cache['tab' + sender.tab.id] = request;

            chrome.storage.local.set(data);

        });

        chrome.browserAction.setBadgeBackgroundColor(Background.TimeToColor(request.time));
        chrome.browserAction.setBadgeText({text: request.time, tabId: sender.tab.id});

    },

    OnTabClosed: function (tabId) {
        chrome.storage.local.get('cache', function(data) {
            if (data.cache) delete data.cache['tab' + tabId];
            chrome.storage.local.set(data);
        });
    },
    
    TimeToColor: function (speedTime) {

        var color = "";
        var time = parseFloat(speedTime);

        if(time < 3)
            color = "#2ecc71";
        else if(time < 5)
            color = "#1abc9c";
        else if(time < 10)
            color = "#e67e22";
        else
            color = "#c0392b";

        return { color: color };
    },

    TimeToText: function (speedTime) {

        var text = "";
        var time = parseFloat(speedTime);

        if(time < 3)
            text = "A+";
        else if(time < 5)
            text = "B";
        else if(time < 10)
            text = "DD";
        else
            text = "FF";

        return text;
    }
    
};

Background.init();
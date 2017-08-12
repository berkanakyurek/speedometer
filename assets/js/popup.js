var Popup = {
    
    init: function () {
        Popup.Router.init();
        Popup.Monitor.init();
        Popup.Setting.init();
    },

    Router: {

        settingBtn: document.getElementById('settingBtn'),

        monitorSection: document.getElementById('monitor'),
        settingSection: document.getElementById('setting'),

        init: function () {
            Popup.Router.settingBtn.addEventListener('click',Popup.Router.SettingAction);
        },

        SettingAction: function () {

            if(Popup.Router.settingSection.classList.contains('hidden'))
            {
                Popup.Router.monitorSection.classList.add('hidden');
                Popup.Router.settingSection.classList.remove('hidden');
            }
            else
            {
                Popup.Router.monitorSection.classList.remove('hidden');
                Popup.Router.settingSection.classList.add('hidden');
            }

            return false;
        }
    },

    Monitor: {

        SiteTitle: document.getElementById('monitorSiteTitle'),

        init: function () {

            chrome.tabs.getSelected(null, Popup.Monitor.TabSelected);

        },

        TabSelected: function (tab) {

            //Popup.Monitor.SiteTitle.innerHTML = "Site: <strong>"+tab.title+"</strong>";

            chrome.storage.local.get('cache', function(data) {
                if(typeof data.cache['tab' + tab.id] !== 'undefined')
                    Popup.Monitor.SetData(tab, data.cache['tab' + tab.id]);
            });

        },
        
        SetData: function (tab,data) {

            document.getElementById('monitorTableWebsiteSpeed').innerHTML = data.time + " s";

            var label = '' +
                '<span ' +
                    'class="label" ' +
                    'style="background-color: ' + (Popup.Monitor.TimeToColor(data.time)) + '">' +

                    (Popup.Monitor.TimeToText(data.time)) +

                '</span>';

            document.getElementById('monitorTableWebsiteSpeedQuality').innerHTML = label;

        },

        TimeToColor: function (time) {

            var color = "";
            var time = parseFloat(time);

            if(time < 3)
                color = "#2ecc71";
            else if(time < 5)
                color = "#1abc9c";
            else if(time < 10)
                color = "#e67e22";
            else
                color = "#c0392b";

            return color;
        },

        TimeToText: function (time) {

            var text = "";
            var time = parseFloat(time);

            if(time < 3)
                text = "Very Good";
            else if(time < 5)
                text = "Good";
            else if(time < 10)
                text = "Normal";
            else
                text = "Bad";

            return text;
        }

    },

    Setting: {

        saveBtn: document.getElementById('saveSettingBtn'),
        backBtn: document.getElementById('turnMonitorBtn'),
        settingMessageDiv: document.getElementById('settingMessage'),
        showInfoOnIconCb: document.getElementById('showInfoOnIconCb'),

        init: function () {
            Popup.Setting.Get();
            Popup.Setting.saveBtn.addEventListener('click',Popup.Setting.Save);
            Popup.Setting.backBtn.addEventListener('click',Popup.Router.SettingAction);
        },

        Get: function(){

            chrome.storage.local.get('setting',function(data) {

                if(typeof data.setting !== 'undefined')
                {
                    Popup.Setting.showInfoOnIconCb.checked = data.setting.showInfoOnIcon;
                }

            });

        },

        Save: function () {

            Popup.Setting.settingMessageDiv.classList.add('hidden');

            var saveData = {
                showInfoOnIcon: false
            };

            if(document.querySelector('#showInfoOnIconCb:checked'))
                saveData.showInfoOnIcon = true;

            chrome.storage.local.set({setting: saveData});

            Popup.Setting.settingMessageDiv.classList.remove('hidden');

            setTimeout(function () {
                Popup.Setting.settingMessageDiv.classList.add('hidden');
            },3000);

            return false;
        }
        
    }
    
}

document.addEventListener("DOMContentLoaded", Popup.init);
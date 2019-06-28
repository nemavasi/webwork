package ru.alex.settings.impl;

import com.atlassian.plugin.spring.scanner.annotation.export.ExportAsService;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.sal.api.pluginsettings.PluginSettings;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import ru.alex.settings.api.PluginSettingService;

import javax.inject.Inject;
import javax.inject.Named;

//@ExportAsService({PluginSettingService.class})
//этот бин спринга будет хранить строковые значения настроек по плагину
@Named
public class PluginSettingsServceImpl implements PluginSettingService {

    private final PluginSettings pluginSettings;
    private static final String PLUGIN_STORAGE_KEY = "ru.alex.settings.";
    private static final String CONFIG_OFM = "ofm";


    @Inject
    public PluginSettingsServceImpl(@ComponentImport PluginSettingsFactory pluginSettingsFactory) {
//        this.pluginSettings = pluginSettings;
        this.pluginSettings = pluginSettingsFactory.createGlobalSettings();
    }

    //достаем значение установок по  ru.alex.settings.<ключ>
    private String getSettingValue(String settingKey) {
        if (settingKey == null) {
            return "";
        } else {
            return (String) pluginSettings.get(PLUGIN_STORAGE_KEY + settingKey);
        }
    }

    //уставливаем значение установок по  ru.alex.settings.<ключ>
    private void setSettingValue(String settingKey, String settingValue) {
        if (settingKey == null)
            return;

        if (settingValue == null) {
            this.pluginSettings.put(PLUGIN_STORAGE_KEY + settingKey,"");
        } else {
            this.pluginSettings.put(PLUGIN_STORAGE_KEY + settingKey, settingValue);
        }
    }

    //короче говоря получаем данные по ключу ru.alex.settings.ofm
    @Override
    public String getConfigJson() {
        return getSettingValue(CONFIG_OFM);
    }

    //короче говоря устанавливаем данные по ключу ru.alex.settings.ofm
    @Override
    public void setConfigJson(String settingValueInJsonFormat) {
        setSettingValue(CONFIG_OFM, settingValueInJsonFormat);
    }
}

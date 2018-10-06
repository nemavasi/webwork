package ru.alex.settings.api;

public interface PluginSettingService {
    String getConfigJson();
    void setConfigJson(String json);
}

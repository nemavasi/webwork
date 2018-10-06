package ru.alex.settings.jira.webwork;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.customfields.option.Option;
import com.atlassian.jira.issue.customfields.option.Options;
import com.atlassian.jira.issue.fields.CustomField;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.atlassian.jira.web.action.JiraWebActionSupport;
import ru.alex.settings.api.PluginSettingService;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
//import javax.inject.Named;

//@Named
public class ConfigWebwork extends JiraWebActionSupport
{
    private static final Logger log = LoggerFactory.getLogger(ConfigWebwork.class);
    private final PluginSettingService pluginSettingService;
    // настройки параметров - размещение пользователей по полям
    private String configJson;

    // настройки полей - идентификаторы полей
    private String idvOFM;
    private String idizOFM;

    // настройки полей - значения каждого поля
    private List<String> vOFMlist;
    private List<String> izOFMlist;

    // настройки полей - значения каждого поля и пользователи
    private List<TableParams> vOFMparams;



    @Inject
    public ConfigWebwork(PluginSettingService pluginSettingService) {
        this.pluginSettingService = pluginSettingService;
    }

    @Override
    public String execute() throws Exception {
        super.execute();
        log.warn("=== execute ===");
        return SUCCESS;
    }

    @Override
    public String doDefault() throws Exception {
        super.doDefault();
        log.warn("=== default ===");
        return SUCCESS;
    }

    public String getConfigJson() {
        String cfg = pluginSettingService.getConfigJson();

        if (cfg.isEmpty()) {
            return "{}";
        } else {
            return cfg;
        }
    }

    public void setConfigJson(String json) {
        this.configJson = json;
    }

    public void doSave() {
        pluginSettingService.setConfigJson(configJson);
    }

    public String doTest() {
        String cfg = pluginSettingService.getConfigJson();
        log.warn("=== " + cfg + " ===");

        CustomField cf_vOFM = ComponentAccessor.getCustomFieldManager().getCustomFieldObject(10000L);
        Options opts_vOFM = ComponentAccessor.getOptionsManager().getOptions(cf_vOFM.getConfigurationSchemes().listIterator().next().getOneAndOnlyConfig());

        for (Option option : opts_vOFM) {
            String optValue = option.getValue();
            log.warn("    " + optValue + " ===");
        }

        return SUCCESS;
    }


    private String getCustomFieldIdFromJson(String typeZayav) {
        String cfg = pluginSettingService.getConfigJson();

        JsonParser parser = new JsonParser();
        JsonArray mainArray = parser.parse(cfg).getAsJsonArray();
        for (JsonElement param : mainArray) {
            JsonObject typeObject = param.getAsJsonObject();
            if (typeZayav.equals(typeObject.get("ztype").getAsString())) {
                return typeObject.get("id").getAsString();
            }
        }
        return null;
    }


    private List<String> getOfmFieldSettings(String fieldId) {
        List<String> local_OFMlist = new ArrayList<String>();

        CustomField cf_OFM = ComponentAccessor.getCustomFieldManager().getCustomFieldObject(fieldId);
        Options opts_OFM = ComponentAccessor.getOptionsManager().getOptions(cf_OFM.getConfigurationSchemes().listIterator().next().getOneAndOnlyConfig());

        for (Option option : opts_OFM) {
            local_OFMlist.add(option.getValue());
        }
        return local_OFMlist;
    }

    public String getIdvOFM() {
        return getCustomFieldIdFromJson("vofm");
    }

    public String getIdizOFM() {
        return getCustomFieldIdFromJson("izofm");
    }

    public List<String> getvOFMlist() {
        String idvOFM = getCustomFieldIdFromJson("vofm");
        return getOfmFieldSettings("customfield_" + idvOFM);
        // return getOfmFieldSettings("customfield_10000");
    }

    public List<String> getIzOFMlist() {
        String idizOFM = getCustomFieldIdFromJson("izofm");
        return getOfmFieldSettings("customfield_" + idizOFM);
        // return getOfmFieldSettings("customfield_10001");
    }

    public List<TableParams> getvOFMparams() {
        // идея такая - таблицы формируем из возможных значений полей, а пользоваетелей для таблицы ищем в настройках полей которые хранятся в json

        return null;
    }
}

package ru.alex.settings.jira.webwork;

import com.atlassian.jira.bc.group.search.GroupPickerSearchService;
import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.user.util.UserManager;
import com.atlassian.jira.issue.customfields.option.Option;
import com.atlassian.jira.issue.customfields.option.Options;
import com.atlassian.jira.issue.fields.CustomField;
import com.atlassian.jira.security.groups.GroupManager;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.user.util.UserManager;
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
import java.util.Set;
//import javax.inject.Named;


import com.atlassian.crowd.embedded.api.Group;

//@Named  //закомментировано так как это не бин Спринга - а страница
public class ConfigWebwork extends JiraWebActionSupport
{
    private static final Logger log = LoggerFactory.getLogger(ConfigWebwork.class);
    private final PluginSettingService pluginSettingService;
    // настройки параметров - размещение пользователей по полям
    private String configJson;

    // настройки полей - идентификаторы полей

    private String idvOFM;     //замаппены на вьюху велосити эти два поля
    private String idizOFM;    //это идентификаторы полей в ОФМ и из ОФМ

    // настройки полей - значения каждого поля и пользователи
    private List<TableParams> vOFMparams;
    private List<TableParams> izOFMparams;

    private ApplicationUser bossOFM;  //поле руководителя замаппено на вьюху велосити внутри JSON через геттер

    // менеджер пользователей
    UserManager userManager = ComponentAccessor.getUserManager();
    // тут параметры для таблицы руководителей групп
    //private List<String> allGroups;


    //инжектируем из контейнера спринга наш бин настроек в каждую создаваемую страницу
    @Inject
    public ConfigWebwork(PluginSettingService pluginSettingService) {
        this.pluginSettingService = pluginSettingService;
    }

    @Override
    public String execute() throws Exception {
        super.execute();
//        log.warn("=== execute ===");
        return SUCCESS;
    }

    @Override
    public String doDefault() throws Exception {
        super.doDefault();
//        log.warn("=== default ===");
        return SUCCESS;
    }

    //получение данных с бина настроек !!!
    public String getConfigJson() {
        String cfg = pluginSettingService.getConfigJson();

        if (cfg.isEmpty()) {
            return "{}";
        } else {
            return cfg;
        }
    }

    //сохраняем этот параметр пока в текущую страницу
    public void setConfigJson(String json) {
        this.configJson = json;
    }

    //передаем параметр с локальной страницы в бин настроек
    public void doSave() {
        pluginSettingService.setConfigJson(configJson);
    }

    public String doTest() {
        String cfg = pluginSettingService.getConfigJson();
//        log.warn("=== " + cfg + " ===");

        CustomField cf_vOFM = ComponentAccessor.getCustomFieldManager().getCustomFieldObject(10000L);
        Options opts_vOFM = ComponentAccessor.getOptionsManager().getOptions(cf_vOFM.getConfigurationSchemes().listIterator().next().getOneAndOnlyConfig());

        for (Option option : opts_vOFM) {
            String optValue = option.getValue();
//            log.warn("    " + optValue + " ===");
        }

        return SUCCESS;
    }

    // параметры настраиваемых полей
    // идентификатор настраиваемого поля
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

    // опции настраиваемого поля (варианты выбора)
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

    // получаем параметры из json для процессов офм  - на входе собственно одно из двух значений vofm или izofm
    private List<TableParams> paramsForOFMprocType(String procType) {
        // идея такая - таблицы формируем из возможных значений полей, а пользоваетелей для таблицы ищем в настройках полей которые хранятся в json

        // возможные значения полей
        List<String> fieldValues = null;

        // параметры таблиц
        List<TableParams> listTableParams = new ArrayList<TableParams>();

        // тип запроса ОФМ
        String typeProcOFM = "";
        // идентификатор поля
        String cfId = "";

        //получаем все данные которые хранит бин спринга настроек
        String cfg = pluginSettingService.getConfigJson();

        JsonParser parser = new JsonParser();
        JsonArray mainArray = parser.parse(cfg).getAsJsonArray();
        for (JsonElement fieldParam : mainArray) {
            JsonObject typeObject = fieldParam.getAsJsonObject();

            //cfId = typeObject.get("id").getAsString();
            cfId = getCustomFieldIdFromJson(procType);
            fieldValues = getOfmFieldSettings("customfield_" + cfId);


            for (String fieldVal : fieldValues) {


                if (procType.equals(typeObject.get("ztype").getAsString())) {

                    List<ApplicationUser> users = new ArrayList<ApplicationUser>();

                    JsonArray valueParams = typeObject.get("params").getAsJsonArray();

                    for (JsonElement oneValueParamsArr : valueParams) {
                        JsonObject oneValueParamsObject = oneValueParamsArr.getAsJsonObject();
                        String fieldValueParam = oneValueParamsObject.get("name").getAsString();

                        //if (fieldValues.contains(fieldValueParam)){
                        if (fieldVal.equals(fieldValueParam)){
                            JsonArray usersArray = oneValueParamsObject.get("users").getAsJsonArray();

                            for (JsonElement oneUser : usersArray) {
                                //ApplicationUser user = userManager.getUser(oneUser.getAsString());
                                //ApplicationUser user = userManager.getUserByKey(oneUser.getAsString());
                                ApplicationUser user = userManager.getUserByName(oneUser.getAsString());
                                users.add(user);
//                                user.getName();
//                                user.getUsername();
                            }
                        }
                    }

                    TableParams tableParams = new TableParams(fieldVal, users);
                    listTableParams.add(tableParams);

                }

            }
         }
        return listTableParams;

    }

    //возвращает список. каждый элемент которой включает имя таблицы и в ней список пользователей Jira
    public List<TableParams> getvOFMparams() {
        return paramsForOFMprocType("vofm");
    }

    //возвращает список. каждый элемент которой включает имя таблицы и в ней список пользователей Jira
    public List<TableParams> getIzOFMparams() {
        return paramsForOFMprocType("izofm");
    }

    private ApplicationUser paramsForBossOFM() {
        String userName = "";
        ApplicationUser bossOFM = null;

        String cfg = pluginSettingService.getConfigJson();

        JsonParser parser = new JsonParser();
        JsonArray mainArray = parser.parse(cfg).getAsJsonArray();
        for (JsonElement fieldParam : mainArray) {
            JsonObject typeObject = fieldParam.getAsJsonObject();
            if ("vofm".equals(typeObject.get("ztype").getAsString())) {
                userName = typeObject.get("bossofm").getAsString();
                //устанавливаем начальника
                bossOFM = userManager.getUserByName(userName);
            }


        };
        return bossOFM;
    }

    public ApplicationUser getBossOFM() {
        return paramsForBossOFM();
    }

    //    // получаем значения всех групп
//    public List<String> getAllGroups() {
//        UserManager userManager = ComponentAccessor.getUserManager();
//        Set<Group> groupSet = userManager.getAllGroups();
//
//        List<String> groupList = new ArrayList<String>();
//
//        for (Group groupOne: groupSet) {
//            groupList.add(groupOne.getName());
//        }
//        return groupList;
//    }

//    public String doGetUsersFromGroup() {
//
//        //return "";
//
//        String retval = "[{\"label\": \"First Value\"},  {\"label\": \"Second Value\"}, {\"label\": \"Third Value\", \"value\": \"third-value\"}]";
//
//        log.warn(retval);
//
//        return retval;
////        {"label": "Fourth Value", "value": "fourth-value", "img-src": "url/avatar.png"}
////]
//
//
//    }

}

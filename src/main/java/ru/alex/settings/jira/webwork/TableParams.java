package ru.alex.settings.jira.webwork;

import java.util.List;

public class TableParams {
    private String tableName;
    private List<String> users;

    public TableParams(String tableName, List<String> users) {
        this.tableName = tableName;
        this.users = users;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public List<String> getUsers() {
        return users;
    }

    public void setUsers(List<String> users) {
        this.users = users;
    }
}

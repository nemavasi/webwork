package ru.alex.settings.jira.webwork;

import com.atlassian.jira.user.ApplicationUser;

import java.util.List;

public class TableParams {
    private String tableName;
    private List<ApplicationUser> users;

    public TableParams(String tableName, List<ApplicationUser> users) {
        this.tableName = tableName;
        this.users = users;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public List<ApplicationUser> getUsers() {
        return users;
    }

    public void setUsers(List<ApplicationUser> users) {
        this.users = users;
    }
}
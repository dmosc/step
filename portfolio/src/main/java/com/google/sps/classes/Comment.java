package com.google.sps.classes;

public class Comment {
    private String username;
    private String comment;

    public Comment(String _username, String _comment) {
        username = _username;
        comment = _comment;
    }

    public String getUsername() {
        return username;
    }

    public String getComment() {
        return comment;
    }
}
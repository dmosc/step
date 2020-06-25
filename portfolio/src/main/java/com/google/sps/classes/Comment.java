package com.google.sps.classes;

public class Comment {
    private String username;
    private String comment;
    private long timestamp;

    public Comment(String _username, String _comment, long _timestamp) {
        username = _username;
        comment = _comment;
        timestamp = _timestamp;
    }

    public String getUsername() {
        return username;
    }

    public String getComment() {
        return comment;
    }

    public long getTimeStamp() {
        return timestamp;
    }
}
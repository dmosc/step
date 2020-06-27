package com.google.sps.classes;

public class Comment {
    private final String username;
    private final String comment;
    private final long timestamp;
    private final long id;

    public Comment(String username, String comment, long timestamp, long id) {
        this.username = username;
        this.comment = comment;
        this.timestamp = timestamp;
        this.id = id;
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

    public long getId() {
        return id;
    }
}
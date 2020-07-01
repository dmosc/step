package com.google.sps.classes;

public class Comment {
    private final String username;
    private final String comment;
    private final long timestamp;
    private final long id;
    private final String emotion;

    public Comment(String username, String comment, long timestamp, String emotion, long id) {
        this.username = username;
        this.comment = comment;
        this.timestamp = timestamp;
        this.emotion = emotion;
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
    
    public String getEmotion() {
        return emotion;
    }

    public long getId() {
        return id;
    }
}
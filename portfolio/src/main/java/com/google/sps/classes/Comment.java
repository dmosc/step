package com.google.sps.classes;

public class Comment {
    private final String username;
    private final String comment;
    private final long timestamp;
    private final long id;
    private final double sentiment;

    public Comment(String username, String comment, long timestamp, double sentiment, long id) {
        this.username = username;
        this.comment = comment;
        this.timestamp = timestamp;
        this.sentiment = sentiment;
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

    public double getSentiment() {
        return sentiment;
    }

    public long getId() {
        return id;
    }
}
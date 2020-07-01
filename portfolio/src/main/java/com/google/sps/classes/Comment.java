package com.google.sps.classes;

public class Comment {
    private final String username;
    private final String comment;
    private final long timestamp;
    private final long id;
    private final double sentiment;
    private final String emotion;

    public Comment(String username, String comment, long timestamp, double sentiment, String emotion, long id) {
        this.username = username;
        this.comment = comment;
        this.timestamp = timestamp;
        this.sentiment = sentiment;
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

    public double getSentiment() {
        return sentiment;
    }
    
    public String getEmotion() {
        return emotion;
    }

    public long getId() {
        return id;
    }
}
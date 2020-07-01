// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import com.google.gson.Gson;
import com.google.sps.classes.Comment;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.json.simple.JSONObject;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/comments")
public class CommentsServlet extends HttpServlet {
    private final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    private enum Emotion { Happy, Neutral, Mad };

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;");

        Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

        int limit = Integer.parseInt(request.getParameter("limit"));

        PreparedQuery comments = datastore.prepare(query);
        List<Comment> commentsToSet = new ArrayList<>();
        for (Entity entity : comments.asIterable(FetchOptions.Builder.withLimit(limit))) {
            String username = (String) entity.getProperty("username");
            String comment = (String) entity.getProperty("comment");
            long timestamp = (long) entity.getProperty("timestamp");
            String emotion = (String) entity.getProperty("emotion");
            long id = entity.getKey().getId();

            Comment commentToSet = new Comment(username, comment, timestamp, emotion, id);
            commentsToSet.add(commentToSet);
        }

        Gson gson = new Gson();
        String payload = gson.toJson(commentsToSet);

        response.getWriter().println(payload);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;");
        Gson gson = new Gson();

        String body = getBody(request);
        JSONObject json = new JSONObject();
        try {
            JSONParser parser = new JSONParser();
            json = (JSONObject) parser.parse(body);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String username = getAttribute(json, "username", "Anonymous");
        String comment = getAttribute(json, "comment", "...");
        long timestamp = System.currentTimeMillis();
        double sentiment = analyzeSentiment(comment);
        Emotion emotion =
            sentiment >= -1 && sentiment <= -0.3 ? Emotion.Mad :
            sentiment > -0.3 && sentiment <= 0.3 ? Emotion.Neutral :
            Emotion.Happy;

        Entity commentEntity = new Entity("Comment");
        commentEntity.setProperty("username", username);
        commentEntity.setProperty("comment", comment);
        commentEntity.setProperty("timestamp", timestamp);
        commentEntity.setProperty("emotion", emotion.name());

        datastore.put(commentEntity);

        long id = commentEntity.getKey().getId();

        Comment newComment = new Comment(username, comment, timestamp, emotion.name(), id);

        String payload = gson.toJson(newComment);
        response.getWriter().println(payload);
    }

    private String getParameter(HttpServletRequest request, String parameter, String defaultValue) {
        String value = request.getParameter(parameter);
        if (value == null) {
            return defaultValue;
        }

        return value;
    }

    private String getAttribute(JSONObject json, String attribute, String defaultValue) {
        String value = (String) json.get(attribute);
        if (value == null) {
            return defaultValue;
        }

        return value;
    }

    private String getBody(HttpServletRequest request) throws IOException {
        if ("POST".equalsIgnoreCase(request.getMethod())) {
            Scanner s = new Scanner(request.getInputStream(), "UTF-8").useDelimiter("\\A");
            return s.hasNext() ? s.next() : "";
        }

        return "";
    }

    private double analyzeSentiment(String comment) throws IOException {
        try (LanguageServiceClient languageService = LanguageServiceClient.create()) {
            Document document = Document
                .newBuilder()
                .setContent(comment)
                .setType(Document.Type.PLAIN_TEXT)
                .build();

            double sentiment = (double) languageService
                .analyzeSentiment(document)
                .getDocumentSentiment()
                .getScore();

            return sentiment;
        }
    }
}

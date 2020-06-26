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
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import com.google.gson.Gson;
import com.google.sps.classes.Comment;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/comments")
public class CommentsServlet extends HttpServlet {
    private DatastoreService datastore;

    @Override public void init() {
        datastore = DatastoreServiceFactory.getDatastoreService();
    }

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
            long id = entity.getKey().getId();

            Comment commentToSet = new Comment(username, comment, timestamp, id);
            commentsToSet.add(commentToSet);
        }

        Gson gson = new Gson();
        String payload = gson.toJson(commentsToSet);

        response.getWriter().println(payload);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;");

        long timestamp = System.currentTimeMillis();
        String username = getParameter(request, "username", "Anonymous");
        String comment = getParameter(request, "comment", "...");

        Entity commentEntity = new Entity("Comment");
        commentEntity.setProperty("username", username);
        commentEntity.setProperty("comment", comment);
        commentEntity.setProperty("timestamp", timestamp);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(commentEntity);

        response.sendRedirect("/index.html");
    }

    private String getParameter(HttpServletRequest request, String parameter, String defaultValue) {
        String value = request.getParameter(parameter);
        if (value == null) {
            return defaultValue;
        }

        return value;
    }
}

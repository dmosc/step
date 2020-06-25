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

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import com.google.gson.Gson;
import com.google.sps.classes.Comment;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/comments")
public class CommentsServlet extends HttpServlet {
    private List<Comment> comments;

    @Override
    public void init() {
        comments = new ArrayList<>();
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;");

        List<Comment> newest_comments = comments.subList(0, comments.size() > 5 ? 5 : comments.size());
        Gson gson = new Gson();
        String payload = gson.toJson(newest_comments);

        response.getWriter().println(payload);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;");

        String username, comment;
        username = request.getParameter("username").length() > 0 ? request.getParameter("username") : "Anonymus";
        comment = request.getParameter("comment");

        System.out.println(username);
        comments.add(0, new Comment(username, comment));

        Gson gson = new Gson();
        String payload = gson.toJson(comment);

        response.sendRedirect("/index.html");
        response.getWriter().println(payload);
    }
}

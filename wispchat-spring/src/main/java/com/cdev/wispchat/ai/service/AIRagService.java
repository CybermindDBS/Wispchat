package com.cdev.wispchat.ai.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIRagService {
    VectorStore vectorStore;

    public AIRagService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @Tool(description = "Fetch past conversation facts of an user via query and user ID.")
    public String fetchUserFactsFromLongTermMemory(String query, String userId) {

        FilterExpressionBuilder filterExpressionBuilder = new FilterExpressionBuilder();

        Filter.Expression filter = filterExpressionBuilder.eq("userId", userId).build();

        SearchRequest searchRequest = SearchRequest.builder()
                .query(query).filterExpression(filter).topK(10).similarityThreshold(0.7).build();

        List<Document> results = vectorStore.similaritySearch(searchRequest);

        if (results.isEmpty()) {
            return "No relevant past memories found for this query.";
        }

        return results.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n---\n"));
    }

    @Tool(description = "Fetch past conversation facts from a chatroom via optimised keywords based query and chatroom ID.")
    public String fetchChatroomFactsFromLongTermMemory(String query, String chatroomId) {
        System.out.println("query: " + query);

        FilterExpressionBuilder filterExpressionBuilder = new FilterExpressionBuilder();

        Filter.Expression filter = filterExpressionBuilder.eq("chatroomId", chatroomId).build();

        SearchRequest searchRequest = SearchRequest.builder().query(query).filterExpression(filter).topK(10).similarityThreshold(0.6).build();

        List<Document> results = vectorStore.similaritySearch(searchRequest);

        if (results.isEmpty()) {
            return "No relevant past memories found for this query.";
        }

        return results.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n---\n"));
    }
}

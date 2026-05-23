package com.cdev.wispchat.ai.service;

import com.cdev.wispchat.kafka.producer.AiRequestProducer;
import com.cdev.wispchat.model.dto.EventDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.VectorStoreChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.ai.chat.memory.ChatMemory.CONVERSATION_ID;

@Service
public class AIOrchestratorService {

        AIResponseService aiResponseService;
        ChatClient chatClient;
        ChatMemory chatMemory;
        VectorStore vectorStore;
        AiRequestProducer aiRequestProducer;

        public AIOrchestratorService(AIResponseService aiResponseService, ChatClient
        chatClient, ChatMemory chatMemory, VectorStore vectorStore, AiRequestProducer aiRequestProducer) {
        this.aiResponseService = aiResponseService;
        this.chatClient = chatClient;
        this.chatMemory = chatMemory;
        this.vectorStore = vectorStore;
        }

        public void registerRequest(EventDTO requestDTO) {
                aiRequestProducer.sendMessage(requestDTO);
        }

        public void processRequest(EventDTO requestDTO) {
        List<Document> documents = vectorStore.similaritySearch(
        SearchRequest.builder()
        .query(requestDTO.getContent())
        .topK(5)
        .filterExpression("conversationId == '" + requestDTO.getChatroomId() + "' || userId == '" + requestDTO.getSenderId() + "'")
        .build());

        String longTermMemory = documents.stream()
        .map(Document::getText)
        .collect(Collectors.joining("\n"));

        String response = chatClient.prompt()
        .system(s -> s.text("The current chatroom id is {chatroom}, few facts from this chatroom or about this user: {memory}")
        .param("chatroom", requestDTO.getChatroomId())
        .param("memory", longTermMemory.isEmpty() ? "No prior facts known." :
        longTermMemory))
        .user(u -> u.text("{name} (ID: {id}): {content}")
        .param("name", requestDTO.getSenderId())
        .param("id", requestDTO.getSenderId())
        .param("content", requestDTO.getContent()))
        .advisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
        // .advisors(QuestionAnswerAdvisor.builder(vectorStore).build())
        //
        .advisors(VectorStoreChatMemoryAdvisor.builder(vectorStore).defaultTopK(10).build())
        .advisors(advisorSpec -> advisorSpec.param(CONVERSATION_ID,
        requestDTO.getChatroomId()))
        .call()
        .content();

        EventDTO responseDTO = new EventDTO();
        responseDTO.setContent(response);
        responseDTO.setChatroomId(requestDTO.getChatroomId());
        aiResponseService.sendMessage(responseDTO);

        decideAndSaveMemory(requestDTO, response, longTermMemory);
        }

        private void decideAndSaveMemory(EventDTO requestDTO, String aiMsg, String longTermMemory) {
                String decisionPrompt = """
                                ### ROLE
                                You are a Memory Extraction Engine. Your goal is to identify PERMANENT user traits, preferences, or identity facts.

                                ### INPUT DATA
                                - User ID: %s
                                - Existing Memory: [%s]
                                - Current Exchange:
                                    User: "%s"
                                    AI: "%s"

                                ### EXTRACTION RULES
                                1. PERSISTENCE: Only extract facts that are true beyond this specific conversation (e.g., "User likes COD" is a fact; "User is hungry" is a transient state, IGNORE it).
                                2. REDUNDANCY: Compare with "Existing Memory". If the fact is already known, do not extract it.
                                3. ATOMICITY: Each fact must be a standalone declarative sentence.
                                4. NO CHATTER: Do not explain your reasoning.
                                5. SOURCE: Extract facts only from the User's input. Use AI response only for context and for eliminating duplicates.

                                ### OUTPUT FORMAT
                                - If new facts are found: "User [%s] [Specific Fact]"
                                - If no new/durable facts are found: SKIP
                                """
                                .formatted(
                                                requestDTO.getSenderId(),
                                                longTermMemory,
                                                requestDTO.getContent(),
                                                aiMsg,
                                                requestDTO.getSenderId());

                String summary = chatClient.prompt()
                                .user(decisionPrompt)
                                .call()
                                .content();

                if (!summary.equalsIgnoreCase("SKIP")) {
                        Map<String, Object> metadata = new HashMap<>();
                        metadata.put("conversationId", requestDTO.getChatroomId());
                        metadata.put("userId", requestDTO.getSenderId());
                        metadata.put("createdAt", System.currentTimeMillis());

                        vectorStore.add(List.of(
                                        new Document(summary, metadata)));
                        System.out.println("Memory Saved: " + summary);
                }
        }
}

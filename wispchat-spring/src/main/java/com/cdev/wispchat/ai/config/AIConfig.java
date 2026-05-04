package com.cdev.wispchat.ai.config;

import com.cdev.wispchat.ai.service.AIRagService;
import com.cdev.wispchat.service.ChatroomService;
import com.cdev.wispchat.service.MessageService;
import com.cdev.wispchat.service.UserService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.VectorStoreChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.redis.RedisVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPooled;

@Configuration
public class AIConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, ChatMemory chatMemory, VectorStore vectorStore, MessageService messageService, ChatroomService chatroomService, UserService userService, AIRagService aiRagService) {
        return builder
                .defaultSystem("You are WispChat AI, a helpful and pithy chatroom assistant.")
                .defaultTools(messageService, chatroomService, userService, aiRagService)
                .build();
    }

    @Bean
    public VectorStore vectorStore(EmbeddingModel embeddingModel) {
        JedisPooled jedisPooled = new JedisPooled("localhost", 6379);

        return RedisVectorStore.builder(jedisPooled, embeddingModel)
                .indexName("wisp-index")
                .prefix("doc:")
                .metadataFields(
                        RedisVectorStore.MetadataField.tag("conversationId"),
                        RedisVectorStore.MetadataField.tag("userId")
                )
                .initializeSchema(true)
                .build();
    }
}

package com.cdev.wispchat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WispChatApplication {

    public static void main(String[] args) {
        SpringApplication.run(WispChatApplication.class, args);
    }

}

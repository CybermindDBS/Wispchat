package com.cdev.wispchat.controller;

import com.cdev.wispchat.service.ChatEventService;
import com.cdev.wispchat.service.FileShareService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class FileShareController {
    FileShareService fileShareService;
    ChatEventService chatEventService;


    FileShareController(FileShareService fileShareService, ChatEventService chatEventService) {
        this.fileShareService = fileShareService;
        this.chatEventService = chatEventService;
    }

    @PostMapping("/chatroom/{chatroomId}/upload")
    public ResponseEntity<?> uploadFile(@PathVariable String chatroomId, @RequestParam MultipartFile file) {
        fileShareService.fileUpload(chatroomId, file);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @GetMapping("/chatroom/{chatroomId}/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String chatroomId, @PathVariable String fileId) throws MalformedURLException {

        Path baseDir = Paths.get("Files", chatroomId).normalize();
        Path filePath = baseDir.resolve(fileId).normalize();

        if (!filePath.startsWith(baseDir)) {
            return ResponseEntity.badRequest().build();
        }

        if (!Files.exists(filePath)) return ResponseEntity.notFound().build();

        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileId + "\"")
                .body(resource);
    }
}
